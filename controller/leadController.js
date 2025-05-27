const asyncHandler = require("express-async-handler");
const Lead = require("../models/lead.model.js");
const Comment = require("../models/comment.model.js");
const mongoose = require("mongoose");
//add lead

const addNewLead = asyncHandler(async (req, res, next) => {
  try {
    const lead = new Lead(req.body);
    const saveLead = await lead.save();
    const populatedLead = await Lead.findById(saveLead._id).populate(
      "salesAgent"
    );
    res.status(201).json({ message: "New lead created.", populatedLead });
  } catch (error) {
    res.status(500).json({ error: "Failed to create new lead.", error });
  }
});

//get all lead

const findLeadsWithFilters = asyncHandler(async (req, res) => {
  const { salesAgent, status, tags, source, prioritySort, dateSort } =
    req.query;

  const filter = {};
  if (salesAgent) {
    filter.salesAgent = salesAgent;
  }

  if (status) {
    filter.status = status;
  }

  if (tags) filter.tags = { $in: tags.split(",") };

  if (source) {
    filter.source = source;
  }
  let sortOptions = {};

  const priorityOrder = {
    Low: 1,
    Medium: 2,
    High: 3,
  };

  //priority sorting
  if (prioritySort === "Low-High") {
    sortOptions.priority = 1;
  } else if (prioritySort === "High-Low") {
    sortOptions.priority = -1;
  }

  //date sorting
  if (dateSort) {
    if (dateSort === "Newest-Oldest") {
      sortOptions.createdAt = -1;
    } else if (dateSort === "Oldest-Newest") {
      sortOptions.createdAt = 1;
    }
  }

  try {
    const allLeads = await Lead.find(filter)
      .sort(sortOptions)
      .populate("salesAgent");

    if (prioritySort) {
      allLeads.sort((a, b) => {
        const priorityA = priorityOrder[a.priority] || 0; // Convert to numeric priority
        const priorityB = priorityOrder[b.priority] || 0; // Convert to numeric priority
        return prioritySort === "Low-High"
          ? priorityA - priorityB
          : priorityB - priorityA;
      });
    }
    res.status(200).json(allLeads);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//update lead

const updateLeadById = asyncHandler(async (req, res) => {
  try {
    const leadId = req.params.leadId;
    const dataToUpdate = req.body;

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ error: "Invalid Lead Id" });
    }

    if (dataToUpdate.status === "Closed" && !dataToUpdate.closedAt) {
      dataToUpdate.closedAt = new Date();
    }

    const updatedLead = await Lead.findByIdAndUpdate(leadId, dataToUpdate, {
      new: true,
    });

    if (!updatedLead) {
      return res
        .status(404)
        .json({ error: `Lead with id ${leadId} not found` });
    }

    res.status(200).json(updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


//grouped lead
async function getAllLeads() {
  try {
    const leads = await Lead.find().populate("salesAgent");
    return leads;
  } catch (error) {
    console.log("Error occured while loading leads.", error);
  }
}
const groupedLeadBy = asyncHandler(async (req, res, next) => {
  try {
    const leads = await getAllLeads();
    const groupBy = (keys) => (array) =>
      array.reduce((objectsByKeyValue, obj) => {
        const value = keys.map((key) => obj[key]).join("-");
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});

    const groupByBrand = groupBy(["status"]);

    if (groupByBrand(leads)) {
      res.status(201).json({
        message: "Lead groupedBy is created as: ",
        leadsByStatus: groupByBrand(leads),
      });
    } else {
      res.status(404).json({ error: "Lead not found" });
    }}
   catch (error) {
    res.status(500).json({ error: "Failed to fetch leads", error: error });
  }
});

//findById
// async function findLeadById(leadId) {
//   try {
//     const lead = await Lead.findById(leadId).populate("salesAgent");
//     return lead;
//   } catch (error) {
//     console.log("An error occured while finding lead.", error);
//   }
// }

// const leadFindById = asyncHandler(async (req, res, next) => {
//   try {
//     const lead = await findLeadById(req.params.leadId);
//     if (lead) {
//       res.status(200).json({ lead: lead });
//     } else {
//       res.status(404).json({ error: "Lead not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch lead.", error: error });
//   }
// });

//delete lead

async function deleteLead(leadId) {
  try {
    const lead = await Lead.findByIdAndDelete(leadId);
    return lead;
  } catch (error) {
    console.log("An error occured while deleting lead.", error);
  }
}

const deleteLeadById = asyncHandler(async (req, res, next) => {
  try {
    const lead = await deleteLead(req.params.leadId);
    if (lead) {
      res
        .status(200)
        .json({ message: "Lead deleted successfully.", lead: lead });
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lead.", error: error });
  }
});

//add comment
const addComment = asyncHandler(async (req, res, next) => {
  try {
    const leadId = req.params.leadId;
    const { commentText, author } = req.body;

    const lead = await Lead.findById(leadId);

    const newComment = new Comment({
      lead: leadId,
      commentText,
      author,
    });

    const savedComment = await newComment.save();

    if (!lead) {
      return res
        .status(404)
        .json({ error: `Lead with ID '${leadId}' not found.` });
    }

    if (!commentText) {
      return res
        .status(400)
        .json({ error: "Comment text is required and must be a string." });
    }

    res
      .status(201)
      .json({ message: "Comment added successfully", savedComment });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", error });
  }
});

//get comment
const getAllComment = asyncHandler(async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const lead = await Lead.findById(req.params.leadId);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Fetch all comments for the lead
    const comments = await Comment.find({ lead: leadId }).populate(
      "author",
      "name"
    );
    res.status(200).json({ message: "getting all comments", comments });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", error });
  }
});

module.exports = {
  addNewLead,
  findLeadsWithFilters,
  groupedLeadBy,
  updateLeadById,
  // leadFindById,
  deleteLeadById,
  addComment,
  getAllComment,
};
