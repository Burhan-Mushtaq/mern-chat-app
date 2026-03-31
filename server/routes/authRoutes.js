const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req , res) => {
    const { username , email , password } = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password , 10);

        const user = new User({
            username,
            email,
            password : hashedPassword,
        });

        await user.save();

        console.log("signup hit")
        res.json({message : "User Created"});

    } catch(err){
        res.status(500).json(err);
    }
});

router.post("/login" , async (req , res) => {
    const {email , password} = req.body;

    try{
        const user = await User.findOne({ email});

        if(!user) return res.status(400).json({message : "User not found"});

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch) return res.status(400).json({message : "Wrong password"});

        const token = jwt.sign({id: user._id} , "secretkey" , {expiresIn : "1d"} );

        res.json({ token , user});

    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;