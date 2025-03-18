const asyncHandler = require('express-async-handler')

const Comment = require('../models/comment.model')

const addComment = asyncHandler(async(req,res, next)=>{
  const leadId = req.params.leadId
  console.log(leadId)
    try {
        const commentData =new Comment(req.body) 
        await commentData.save()
        res.status(201).json({message: "New comment is posted"})
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

const getAllComment = asyncHandler(async (req, res, next) => {
    try {
      const allComment = await Comment.find().populate("lead").populate("author")
      res.status(201).json(allComment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  })

  module.exports = {addComment, getAllComment}