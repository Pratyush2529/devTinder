const mongoose=require("mongoose");

const connectionRequestSchema=mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored", "interested", "accepted", "rejected"],
            message:`{VALUE} is not a valid status`
        }
    }
},
{
    timestamps:true
});


//compound index
connectionRequestSchema.index({senderId:1, recieverId:1});

connectionRequestSchema.pre("save", function(next){
    const connectionRequest=this;
    if(connectionRequest.senderId.equals(connectionRequest.recieverId)){
        throw new Error("you cannot send request to yourself");
    }
    next();
})

const ConnectionRequestModel=mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports=ConnectionRequestModel;