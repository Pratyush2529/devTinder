const express=require("express");
const authRouter=express.Router();
const validateSignUpData = require("../utils/validation")
const User=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

authRouter.post("/signup", async (req, res)=>{
    try{
        validateSignUpData(req);
    // console.log(req.body);
    const {firstName, lastName, emailId, password}=req.body;
    const passwordHash=await bcrypt.hash(password, 10);
    const user=new User({
        firstName, lastName, emailId, password:passwordHash,
    });
        await user.save()
        res.send("aa gya ji naya bakra")
    }catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})

authRouter.post("/login", async (req, res)=>{
    try{
        const {emailId, password}=req.body;
        const user=await User.findOne({emailId});
        if(!user){
            throw new Error("invalid credentials");
        }
        const isPasswordValid=await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            const token=jwt.sign({_id:user._id}, "lawdeKaSecret");
            res.cookie("token", token);
            res.send("Login ho gya ji!!")
    }
    else{
        res.status(400).send("invalid credentials");
    }
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})


authRouter.post("/logout", async(req, res)=>{
    try{
        res.clearCookie("token");
        res.send("Logout ho gya ji!!");
    }catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})


module.exports=authRouter;