// const fs=require("fs");

// fs.writeFileSync("./call.txt", "hello world !" );

// fs.writeFile("./call.txt","Hello Wordls async",(err)=>{});

// fs.appendFileSync("./call.txt","hello mb \n");

// fs.rmdirSync("./Node");
// fs.mkdirSync("./backend/a/b/c");
// fs.mkdirSync("./back");

// const os=require("os");
// console.log(os.cpus().length);
const fs= require("fs");
const http=require("http");

const myserver=http.createServer((req,res)=>{
    const log=`${Date.now()}, ${req.method}, ${req.url}: new request recieved \n`;
    fs.appendFile("log.txt",log, (err,data)=>{
        switch(req.url){
            case '/': res.end("my home page");
            break;
            case '/about': res.end(" I am MERN stack dev");
            break;
            case '/signup': 
            if(req.method==="GET"){
                res.end(" I am MERN stack dev");
            }
            else if (req.method==="POST"){
                //data query
                res.end('logineed succused');
            }
            break;
            default:res.end("404");
            break;
        }
    });
    // res.end("Welcome to my server");
});

myserver.listen(8000,()=>{
    console.log("Servere started !!");
})  