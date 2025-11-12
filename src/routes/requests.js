const express = require("express");
const {userAuth}=require("../middlewares/auth");

const requestRouter=express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req, res)=>{
    const user=req.user;
    //sending a connection request
    console.log("sending a connection request");

    res.send(user.firstName+" send a connection request");
});


module.exports=requestRouter;