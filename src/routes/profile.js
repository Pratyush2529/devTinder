const express=require("express");
const {userAuth}=require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const User=require("../models/user");
const bcrypt=require("bcrypt");


const profileRouter=express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res)=>{
    try{
        const user=req.user;
        res.send(user);        
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("invalid edit request");
        }
        const user=req.user;
        const updatedUser=await User.findByIdAndUpdate(user._id, req.body, {new:true});
        res.send({
            message:"profile updated successfully",
            data:updatedUser
        });
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})


profileRouter.patch("/profile/password", userAuth, async(req, res)=>{
    try{
        const user=req.user;
        const password=req.body.password;
        const passwordHash=await bcrypt.hash(password, 10);
        const updatedUser=await User.findByIdAndUpdate(user._id, {password:passwordHash});
        res.send("password updated successfully");
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})

module.exports=profileRouter;