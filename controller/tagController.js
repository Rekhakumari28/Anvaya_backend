const asyncHandler = require('express-async-handler')

const Tag = require('../models/tag.model.js')

const addTag = asyncHandler(async(req, res, next)=>{
    const {name} = req.body
    console.log(name)
    try {
        const tagData =new Tag({name}) 
        await tagData.save()
        res.status(201).json(tagData)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

const getAllTag = asyncHandler(async (req, res, next) => {
    try {
      const allTag = await Tag.find()
      res.status(201).json(allTag);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  })

  module.exports = {addTag, getAllTag}