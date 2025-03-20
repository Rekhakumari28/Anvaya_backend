const asyncHandler = require("express-async-handler");

const SalesAgent = require("../models/salesAgent.model.js");

//addSalesAgent
async function addSalesAgent(newSalesAgent) {
  try {
    const salesAgent = new SalesAgent(newSalesAgent);
    const savedSalesAgent = await salesAgent.save();
    return savedSalesAgent;
  } catch (error) {
    console.log("Error occured while creating SalesAgent", error);
  }
}

const addNewSalesAgent = asyncHandler(async (req, res, next) => {
  try {
    const salesAgent = await addSalesAgent(req.body);
    res
      .status(201)
      .json({ message: "New sales agent created.", salesAgent: salesAgent });
  } catch (error) {
    res.status(500).json({ error: "Failed to create sales agent." });
  }
});

//get all salesAgent

async function getAllSalesAgent() {
  try {
    const salesAgent = await SalesAgent.find();
    return salesAgent;
  } catch (error) {
    console.log("Error occured while fetching all salesAgent", error);
  }
}

const allSalesAgent = asyncHandler(async (req, res, next) => {
  try {
    const salesAgent = await getAllSalesAgent();
    if (salesAgent.length > 0) {
      res.json(salesAgent);
    } else {
      res.status(404).json({ error: "No Sales Agent Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failes to fetch sales agents." });
  }
});

//delete salesAgent

async function deleteSalesAgent(salesAgentId){
    try {
        const salesAgent = await SalesAgent.findByIdAndDelete(salesAgentId)
        return salesAgent
    } catch (error) {
console.log("Error while deleting salesAgent.", error)        
    }
}

const deleteSalesAgentById = asyncHandler(async (req, res, next)=>{
  try {
    const salesAgent = await deleteSalesAgent(req.params.salesAgentId)
    if(salesAgent){
      res.status(200).json({message: "Sales agent deleted successfully.", salesAgent: salesAgent})
    }else{
      res.status(404).json({error: "Sales agent not found."})
    }
  } catch (error) {
  res.status(500).json({error: "Failed to delete sales agent"})    
  }
})


module.exports = { addNewSalesAgent, allSalesAgent, deleteSalesAgentById };
