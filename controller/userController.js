
const User = require('./../models/user.model.js')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

//addUser
exports.registerUser = async(req,res)=>{    
        const {name,email,password} = req.body

        if(!name && !email && !password){
            res.status(400).json({error:"All fields are required."})
        }

        try {
            const existingUser = await User.findOne({email})
            if(existingUser){
            res.status(400).json({error:"Email already registerd."})
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({name, email, password:hashedPassword})

            const saveUser = await newUser.save()
            res.status(201).json({message:"New user registerd.", user: saveUser})
        } catch (error) {
            res.status(500).json({error: "Failed to register.", error})
        }        
}

//getUser

exports.userLogin = async(req,res)=>{
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "User Not Found!" });
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
   
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid Password." });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
      
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({ token, user: userWithoutPassword });
    
  } catch (err) {
    res.status(500).json({ message: "Login Failed. ", err });
  }
}

exports.getAllUser = async (req, res) => {
    try {
      const users = await User.find();
        if (users) {
      return res.status(200).json(users);
    } else {
      return res.status(400).json({ message: "Failed to fetch users" });
    }
    
    } catch (err) {
      res.status(500).json({ message:"Internal server error", err });
    }
  }

 exports.userProfile = async (req,res)=>{
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
      } catch (err) {
        res
          .status(404)
          .json({ message: "Failed to fetch user data.", error: err.message });
      }
  }
