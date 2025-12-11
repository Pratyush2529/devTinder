const express = require("express");
const connectDB=require("./config/databse");
const app = express();
const User=require("./models/user");
const cookieParser=require("cookie-parser");
const cors=require("cors")
const http=require("http");
const dotenv=require("dotenv");
dotenv.config();

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
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);


const server=http.createServer(app);
initializeSocket(server);
connectDB()
.then(()=>{
    console.log("Database connected");
    server.listen(process.env.PORT, () => {
        console.log("Server started on port 7777");
    })
    
})
.catch((err)=>{
    console.error("Database connection error");
});


