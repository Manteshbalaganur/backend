const express=require("express");
const fs=require("fs"); // to file append
const mongoose=require("mongoose");// mogo db connection
let users=require("./MOCK_DATA.json");// data import 
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
  });

const User=new mongoose.model("user",userSchema); //USER MODEL

// middleware - plugins 
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

app.get("/api/users",(req,res)=>{
  res.setHeader("x-myname","mahantesh");
    return res.json(users);
})
// html render hoga 
app.get("/users",(req,res)=>{
    const html=`
    <ul>
    ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})


app.post("/api/users", async (req,res)=>{
    //create users
    const body=req.body;
    if(
      !body|| 
      !body.first_name || 
      !body.last_name || 
      !body.email||
      !body.gender ||
      !body.job_title
    )
    {
        return res.status(400).json({msg:"all fields are required"});
    }
   const result=  await User.create({
        firstName:body.first_name,
        lastName:body.last_name,
        email:body.email, 
        gender:body.gender, 
        jobTitle:body.job_title,

    });
    console.log("result",result);

    return res.status(201).json({msg:"success"});
});


// dynamically select kar sakte hai data koo 
app.get("/api/users/:id",(req,res)=>{
    const id=Number(req.params.id);
    const user=users.find((user)=>user.id ===id);
    return res.json(user);
})

app.listen(PORT,()=>{
    console.log(`server has been started at local port ${PORT} `);
});