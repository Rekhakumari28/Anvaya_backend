const asyncHandler = require("express-async-handler");

const Lead = require("../models/lead.model");

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
    const lead = await addLead(req.body);
    res.status(201).json({ message: "New lead created.", lead: lead });
  } catch (error) {
    res.status(500).json({ error: "Failed to create lead.", error: error });
  }
});

//get all lead
async function getAllLeads() {
  try {
    const lead = await Lead.find()
    return lead;
  } catch (error) {
    console.log("Error occured while fetching leads.");
  }
}

const findAllLeads = asyncHandler(async (req, res, next) => {
  try {

    const leads = await getAllLeads();
    const filters = req.query;
    
  console.log(filters, "filters")
  
  const filteredLeads = leads.filter(lead => {
      let isValid = true;
      for (key in filters) {
       
          isValid = isValid && lead[key]== filters[key]

      }
      return isValid;
  });
 
    if (filteredLeads) {
      res.send(filteredLeads)
    } else if(!filterdLead ){
      res.json(leads)
    } else{
      res.status(404).json({ error: "Leads not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leads", error: error });
  }
});


const filterdLead = asyncHandler(async (req, res, next) => {
  ;
})


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
      const lead = await Lead.findById(leadId).populate('salesAgent')
      return lead;
    } catch (error) {
      console.log("An error occured while finding lead.", error);
    }
  }
  
  const leadFindById = asyncHandler(async (req, res, next) => {
    try {
      const lead = await findLeadById(req.params.leadId);
      if (lead) {
        res
          .status(200)
          .json({ lead: lead });
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

module.exports = { addNewLead, findAllLeads, filterdLead, updateLeadById, leadFindById,  deleteLeadById };
