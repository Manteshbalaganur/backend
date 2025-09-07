const express=require("express");
const fs=require("fs"); // to file append
const mongoose=require("mongoose");// mogo db connection
// let users=require("./MOCK_DATA.json");// data import 
const app=express();
let PORT=8000;
// db connection
mongoose.connect("mongodb://localhost:27017/mahantesh").then(()=>{
    console.log("db connected successfully");
}).catch((err)=>{
    console.log("db connection failed",err);
});
//SCHEMA
const userSchema=new mongoose.Schema({
    firstName:{
      type: String,
      required: true,
    },
    lastName: {
      type:String,
    },
    email:{
      type:String,
      required:true,
      unique:true,
    },  
    jobTitle:{
      type:String,
    },   
    gender:{
      type:String,
    },
    department:{
      type:String,
    },
  }
,{timestamps:true},
);

// const userSchema=new mongoose.Schema({
//     first_name: { type: String, required: true },
//     last_name: { type:String },
//     email: { type:String, required:true, unique:true },
//     job_title: { type:String },
//     gender: { type:String },
// });


const User=new mongoose.model("user",userSchema); //USER MODEL

// middleware - plugins 
// app.use(express.json()); // json data handle karne k liye
app.use(express.urlencoded({extended:false}));

app.use((req,res,next)=>{
  console.log("hello from middleware 1");
  next();
});
app.use((req,res,next)=>{
  console.log("hello from middleware 2");
  // return res.end("No data fetched ");
  next();
});

app.get("/api/users",async(req,res)=>{
  const dbusers=await User.find({});
  res.setHeader("x-myname","mahantesh");

    return res.json(dbusers);
})
// html render hoga 
app.get("/users",async(req,res)=>{
    const dbusers=await User.find({});
    const html=`
    <ul>
    ${dbusers.map((user)=>`<li>${user.firstName} - ${user.lastName} - ${user.email} </li>`)
    .join("")}
    </ul>
    `;
    res.send(html);
})

app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.firstName ||
    !body.lastName ||
    !body.email ||
    !body.gender ||
    !body.jobTitle ||
    !body.department
  ) {
    console.log(req.body) ;
    return res.status(400).json({ msg: "all fields are required" });
  }

  const result = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    gender: body.gender,
    jobTitle: body.jobTitle,
    department: body.department,
  });
  console.log("result", result);
  return res.status(201).json({ msg: "success" });
});
// delete all users
app.delete("/api/users",async(req,res)=>{
  const result=await User.deleteMany({});
  return res.json({msg:"all users deleted"});
});



// dynamically select kar sakte hai data koo 
app// used routes 
.route("/api/users/:id")
  .get(async(req,res)=>{
    const user=await User.findById(req.params.id);
    if(!user){
      return res.status(404).json({msg:"user not found"});
    }
    // const id=Number(req.params.id);
    // const user=users.find((user)=>user.id ===id);
    return res.json(user);
})
.delete(async(req,res)=>{
  const user=await User.findById(req.params.id);
  if(!user){
    return res.status(404).json({msg:"user not found"});
  }
  const result=await User.findByIdAndDelete(req.params.id);
  return res.json({msg:"user deleted",result});
})
.patch(async(req,res)=>{
  const user=await User.findById(req.params.id);  
  if(!user){
    return res.status(404).json({msg:"user not found"});
  }
  const body=req.body;
  const result=await User.findByIdAndUpdate(req.params.id,body,{new:true});
  return res.json({msg:"user updated",result});
})

app.listen(PORT,()=>{
    console.log(`server has been started at local port ${PORT} `);
});