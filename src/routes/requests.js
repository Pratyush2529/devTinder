const express = require("express");
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const User=require("../models/user");

const requestRouter=express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res)=>{
    try{
        const senderId=req.user._id;
        const recieverId=req.params.toUserId;
        const status=req.params.status;
        const recieverUser=await User.findById(recieverId);
        if(!recieverUser){
            throw new Error("reciever user not found");
        }
        if(senderId==recieverId){
            throw new Error("you cannot send request to yourself");
        }
        const allowedStatus=["ignored", "interested",];
        if(!allowedStatus.includes(status)){
            throw new Error("invalid status");
        }
        const existingConnectionRequest=await ConnectionRequest.findOne({
                $or:[
                {senderId, recieverId},
                {senderId:recieverId, recieverId:senderId}
            ]
            });
        if(existingConnectionRequest){
            throw new Error("request already exists");
        }


        const connectionRequest=new ConnectionRequest({senderId, recieverId, status});
        const data=await connectionRequest.save();
        res.json({
            message:"request successfully sent by "+req.user.firstName+" to "+recieverUser.firstName,
            data
        })
        
    }catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
});

requestRouter.patch("/request/review/:status/:requestId", userAuth, async(req, res)=>{
    try{
        const loggedInUser=req.user;
        const status=req.params.status;
        const requestId=req.params.requestId;
        const allowedStatus=['accepted', 'rejected'];
        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            recieverId:loggedInUser._id,
            status:"interested"
        });
        if(!connectionRequest){
            throw new Error("request not found");
        }
        if(!allowedStatus.includes(status)){
            throw new Error("invalid status");
        }
        connectionRequest.status=status;
        const data=await connectionRequest.save();
        res.json({
            message:"request successfully updated",
            data
        })
    }catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})

module.exports=requestRouter;