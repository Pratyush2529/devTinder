const mongoose= require("mongoose");

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://namastedev_Pratyush:EplYapQM4vBkXzcB@namastenode.ok1wo0s.mongodb.net/devTinder")
}

module.exports=connectDB;