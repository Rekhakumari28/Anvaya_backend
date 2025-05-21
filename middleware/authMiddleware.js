
const jwt = require("jsonwebtoken")
require("dotenv").config()


const authMiddleware=  (req, res, next)=>{
  const token = req.headers['authorization']
 
  if(!token){
    return res.status(401).json({message:"No token provided."})
}

  try{
        console.log("Token: ", token)
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Decoded token", decodedToken)

    req.user = decodedToken
    next()
  }catch(error){
    return res.status(402).json({message:"Invalid token"})
  }
}

module.exports = authMiddleware