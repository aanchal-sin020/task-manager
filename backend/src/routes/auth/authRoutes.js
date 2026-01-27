console.log("✅ authRoutes file loaded");

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
             return res.status(400).json({
                 message : "Please provide all fields."
             });
        }
        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                message : "User already exists"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password : hashedPassword
        });
        await newUser.save();
        res.status(201).json({
            message : "User created successfully 🎉",
            user : {
                name : newUser.name,
                email : newUser.email
            }
        });
    }   
    catch(error)
    {
        res.status(500).json({
            message : "Signup failed",
            error : error.message
        });
    }    
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password)
        {
            return res.status(400).json({
                message : "Please provide your email and password"
            });
        }
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                message : "Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            return res.status(400).json({
                message : "Invalid email or password"
            });
        }
        console.log("LOGIN JWT SECRET:", process.env.JWT_SECRET);
        const token = jwt.sign(
            { id : user._id },
            process.env.JWT_SECRET,
            {expiresIn : "7d"}
        );
        res.status(200).json({
            message : "Login successful 🎉",
            token,
            user : {
                name : user.name,
                email : user.email
            }
        });
    }
    catch(error)
    {
        res.status(500).json({
            message : "Login failed",
            error : error.message
        });
    }
});
module.exports = router;