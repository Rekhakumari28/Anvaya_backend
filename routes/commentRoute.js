const express = require('express')

//comment routes
const commentRouter  = express.Router({mergeParams: true})

//import routes functions for comment
const {addComment, getAllComment} = require('../controller/commentController')


//comment route
commentRouter.post('/comments',addComment)
commentRouter.get("/comments", getAllComment)


//export 
module.export= commentRouter