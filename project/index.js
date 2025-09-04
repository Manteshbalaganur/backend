const express=require("express");
const fs=require("fs"); // to file append
const users=require("./MOCK_DATA.json");// data import 
const app=express();
let PORT=8000;

app.get("/api/users",(req,res)=>{
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
 // middleware - plugins 
app.use(express.urlencoded({extended:false}));

app.post("/api/users",(req,res)=>{
    //create users
    const body=req.body;
    users.push({ ...body,id:users.length+1});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        return res.json({status:"success",id:users.length});
    })
})

// app.patch("/api/users/:id",(req,res)=>{
//     return res.json({status:"pending"});
// })
// // dynamically select kar sakte hai data koo 
// app.get("/api/users/:id",(req,res)=>{
//     const id=Number(req.params.id);
//     const user=users.find((user)=>user.id ===id);
//     return res.json(user);
// })

app.listen(PORT,()=>{
    console.log(`server has been started at local port ${PORT} `);
});