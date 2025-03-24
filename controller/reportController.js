const asyncHandler = require('express-async-handler')
const Lead = require('../models/lead.model.js')


const getReportLastWeek = asyncHandler(async(req, res)=>{
    console.log("init")
    try {
      const leads = await Lead.find().populate("salesAgent")
    
      let oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const reportLastWeek = leads.filter(lead=> lead.status === "Closed" &&  new Date(lead.updatedAt) >= oneWeekAgo)
    
    console.log(reportLastWeek)
       res.json({message: "report of closed lead last week: ", reportLastWeek})

    } catch (error) {
        res.status(500).json({ error: "Failed to get report.", error: error }); 
    }
})

const getPipeline  = asyncHandler(async(req, res)=>{
    try {
        const leads = await Lead.find().populate("salesAgent")
        const totalLeads = leads.filter(lead=> lead.status != "Closed").length
       if(totalLeads){
        res.status(201).json({message:`Total lead are in pipeline: ${totalLeads}`, totalLeads})
       }
    } catch (error) {
        res.status(500).json({ error: "Internet server error.", error: error }); 
    }
})


const getLeadClosedByAgent = asyncHandler(async(req, res)=>{   
    
    try {
        const leads = await Lead.find().populate("salesAgent")
       const closedLeads = leads.filter(lead=> lead.status === "Closed")
    
    //     let groupAgentLeads = (leadsData, keys) => {
    //         return leadsData.reduce((result, currentLead) => {
    //             let currentKey = keys(currentLead);
    //             result[currentKey] = result[currentKey] || [];
    //             result[currentKey].push(currentLead);
    //             return result;
    //         }, {});
    //     };
        
    //     let keys = closedLeads => `${closedLeads[`salesAgent`]}_${closedLeads["status"]}`;
     
    //    res.status(201).json({message: "Lead closed by agent", group: groupAgentLeads(closedLeads, keys)})

    const grouped = Object.values(
        closedLeads.reduce((acc, obj) => {
            acc[obj.salesAgent] = acc[obj.salesAgent] || [];
            acc[obj.salesAgent].push(obj);
            return acc;
        }, {})
    )
    
    res.status(201).json({message: "Lead closed by agent", grouped})


    } catch (error) {
        res.status(500).json({ error: "Internet server error.", error: error }); 
    }
})

module.exports = {getReportLastWeek, getPipeline, getLeadClosedByAgent}