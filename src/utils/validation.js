const validator=require("validator");

const validateSignUpData=(req)=>{
    const{firstName, lastName, emailId, password}=req.body;
    if(!firstName || !lastName){
        throw new Error("firstName and lastName are required");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("invalid email hai ji");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password should be strong");
    }
};



const validateEditProfileData=(req)=>{
    const allowedEditFields=["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills"];
    const isEditAllowed=Object.keys(req.body).every(field=>allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports={validateSignUpData, validateEditProfileData};