const mongoose=require("mongoose");
const validator=require("validator");

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        index:true
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email");
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("invalid gender");
            }
        },
    },
    photoUrl:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    about:{
        type:String,
        default:"this is a default bio of the user"
    },
    skills:{
        type:[String]
    }
},
{
    timestamps:true
});

const User=mongoose.model("User", userSchema);

module.exports=User;