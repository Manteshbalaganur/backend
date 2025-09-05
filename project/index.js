const express=require("express");
const fs=require("fs"); // to file append
let users=require("./MOCK_DATA.json");// data import 
const app=express();
let PORT=8000;

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


app.post("/api/users",(req,res)=>{
    //create users
    const body=req.body;
    users.push({ ...body,id:users.length+1});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        return res.status(201).json({status:"success",id:users.length});
    })
})

app.patch("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body; // e.g. { age: 21 }
  
  let user = users.find(u => u.id === id);
  if (!user) return res.status(404).send("User not found");

  Object.assign(user, updates);  // update only given fields
  res.json(user);
});

app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  users = users.filter(u => u.id !== id);
  res.send("User deleted");
});

app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).send("User not found");

  users.splice(index, 1); // remove from array

  // overwrite JSON file with updated users
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
    if (err) return res.status(500).send("Error writing file");
    res.send("User deleted successfully ");
  });
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