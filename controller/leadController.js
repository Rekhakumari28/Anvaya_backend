const asyncHandler = require("express-async-handler");
const Lead = require("../models/lead.model.js");
const Comment = require("../models/comment.model.js");

//add lead
async function addLead(newLead) {
  try {
    const leadData = new Lead(newLead);
    const savedLeadData = await leadData.save();
    return savedLeadData;
  } catch (error) {
    console.log("Error occured while creating lead", error);
  }
}

const addNewLead = asyncHandler(async (req, res, next) => {
  try {
    const { name, source, salesAgent, status, timeToClose, priority } =
      req.body;

    let errorMessage = "";
    if ( !name &&  !source &&!salesAgent && !status && !timeToClose && !priority  ) {
      errorMessage = {
        error:
          "name, source, salesAgent, status, timeToClose, priority all fields are required.",
      };
      res.status(400).json({ error: errorMessage });
    } 
    else if (!name) {
      errorMessage = { error: "Invalid input: 'name' is required." };
      res.status(400).json({ error: errorMessage });
    } 
    else if (!source) {
      errorMessage = { error: "Invalid input: 'source' is required." };
      res.status(400).json({ error: errorMessage });
    } 
    else if (!salesAgent) {
      errorMessage = { error: "Invalid input: 'salesAgent' is required." };
      res.status(400).json({ error: errorMessage });
    } 
    else if (!status) {
      errorMessage = { error: "Invalid input: 'status' is required." };
      res.status(400).json({ error: errorMessage });
    } 
    else if (!timeToClose) {
      errorMessage = { error: "Invalid input: 'timeToClose' is required." };
      res.status(400).json({ error: errorMessage });
    } 
    else if (!priority) {
      errorMessage = { error: "Invalid input: 'priority' is required." };
      res.status(400).json({ error: errorMessage });
    }
     else {
      const lead = await addLead({
        name,
        source,
        salesAgent,
        status,
        timeToClose,
        priority,
      });
      res.status(201).json({ message: "New lead created.", lead: lead });
     }     
    

  } catch (error) {
    res.status(500).json({ error: "Failed to create lead.", error: error });
  }
});

//get all lead
async function getAllLeads() {
  try {
    const lead = await Lead.find().populate("salesAgent");
    return lead;
  } catch (error) {
    console.log("Error occured while fetching leads.");
  }
}

const findAllLeads = asyncHandler(async (req, res, next) => {
  try {
    const leads = await getAllLeads();

    const filters = req.query;

    const filteredLeads = leads.filter((lead) => {
      let isValid = true;
      for (key in filters) {
        isValid = isValid && lead[key] == filters[key];
      }
      return isValid;
    });

    if (filteredLeads) {
      res.send(filteredLeads);
    } else if (!filteredLeads) {
      res.json(leads);
    } else {
      res.status(404).json({ error: "Leads not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leads", error: error });
  }
});

//grouped lead

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
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leads", error: error });
  }
});

//update lead

async function updateLead(leadId, dataToUpdate) {
  try {
    const lead = await Lead.findByIdAndUpdate(leadId, dataToUpdate, {
      new: true,
    });
    return lead;
  } catch (error) {
    console.log("An error occured while updating lead.");
  }
}

const updateLeadById = asyncHandler(async (req, res, next) => {
  try {
    const lead = await updateLead(req.params.leadId, req.body);
    if (lead) {
      res
        .status(200)
        .json({ message: "lead updated successfully.", lead: lead });
    } else {
      res.status(404).json({ error: "lead not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update lead." });
  }
});

//findById
async function findLeadById(leadId) {
  try {
    const lead = await Lead.findById(leadId).populate("salesAgent");
    return lead;
  } catch (error) {
    console.log("An error occured while finding lead.", error);
  }
}

const leadFindById = asyncHandler(async (req, res, next) => {
  try {
    const lead = await findLeadById(req.params.leadId);
    if (lead) {
      res.status(200).json({ lead: lead });
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lead.", error: error });
  }
});

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

    if (!commentText) {
      return res
        .status(400)
        .json({ error: "Comment text is required and must be a string." });
    }
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res
        .status(404)
        .json({ error: `Lead with ID '${leadId}' not found.` });
    }

    const newComment = new Comment({
      lead: leadId,
      commentText,
      author,
    });

    const savedComment = await newComment.save();

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

    if (comments.length > 0) {
      res.status(200).json({ message: "getting all comments", comments });
    } else {
      res.status(404).json({ error: "There is no comment." });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  addNewLead,
  findAllLeads,
  groupedLeadBy,
  updateLeadById,
  leadFindById,
  deleteLeadById,
  addComment,
  getAllComment,
};
