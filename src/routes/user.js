const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/requests", userAuth, async (req, res)=>{
    try{
        const user=req.user;
        const pendingConnectionRequests=await ConnectionRequest.find({
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
        const connections=await ConnectionRequest.find({
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

userRouter.get("/user/feed", userAuth, async(req, res)=>{
    const loggedInUser=req.user;
    const page=parseInt(req.query.page) || 1;
    let limit=parseInt(req.query.limit) || 10;
    limit=limit>50?50:limit;
    const skip=(page-1)*limit;
    const connections=await ConnectionRequest.find({
        $or:[
            {senderId:loggedInUser._id},
            {recieverId:loggedInUser._id}
        ]
    })
    const hideUsersFromFeed=new Set();
    connections.forEach((req)=>{
        hideUsersFromFeed.add(req.senderId.toString());
        hideUsersFromFeed.add(req.recieverId.toString())
    })
    const usersOnFeed=await User.find({
        $and:[
            {_id:{$nin:Array.from(hideUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}}
        ]
    }).select(["firstName", "lastName", "photoUrl about skills"]).skip(skip).limiy(limit);
    res.send(usersOnFeed);
})
module.exports=userRouter;