const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const connectionRequest=require("../models/connectionRequest");

userRouter.get("/user/requests", userAuth, async (req, res)=>{
    try{
        const user=req.user;
        const pendingConnectionRequests=await connectionRequest.find({
            recieverId:user._id,
            status:"interested"
        }).populate("senderId", ["firstName", "lastName"]);
        if(pendingConnectionRequests.length===0){
            throw new Error("no requests found");
        }
        res.send(pendingConnectionRequests);
    }catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})

userRouter.get("/user/connections", userAuth, async(req, res)=>{
    try{
        const user=req.user;
        const connections=await connectionRequest.find({
            $or:[
                {senderId:user._id, status:"accepted"},
                {recieverId:user._id, status:"accepted"},
            ]
        }).populate("senderId", ["firstName", "lastName"]).populate("recieverId", ["firstName", "lastName"]);
        if(connections.length===0){
            throw new Error("no connections found");
        }
        const data=connections.map((row)=>{
            if(row.senderId._id.toString()===user._id.toString()){
                return row.recieverId;
            }else{
                return row.senderId;
            }
        });
        res.send(data);
    }catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})
module.exports=userRouter;