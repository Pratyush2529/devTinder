const express = require("express");
const connectDB=require("./config/databse");
const app = express();
const User=require("./models/user");
const cookieParser=require("cookie-parser");
const cors=require("cors")

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());    

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/requests");
const userRouter=require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
.then(()=>{
    console.log("Database connected");
    app.listen(7777, () => {
        console.log("Server started on port 7777");
    })
    
})
.catch((err)=>{
    console.error("Database connection error");
});


