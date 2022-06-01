//to create the server
require("dotenv").config();
const express=require("express");
const app=express();
const db=require("./models/db");
const cors=require("cors");

app.use(express.json());
app.use(cors());
const PORT=process.env.PORT;

//require routers
const roleRouter=require("./routes/role");
const userRouter=require("./routes/user");
const postRouter=require("./routes/post")




//routers endpoint
app.use("/role",roleRouter);
app.use("/user",userRouter);
app.use("/post",postRouter);



app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})