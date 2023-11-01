const express = require("express");
const product = require("./routes/productRoute");

const app = express();

app.use('/api/v1',product);

app.get("/",(req,res)=>{
    res.send("<h1>Ecommerce website</h1>")
})

app.use("*",(req,res,next)=>{
    const err = new Error("Route not found");
    err.status = "Fail";
    err.statusCode = "500";
    next(err);
})

app.use((err,req,res,next) => {
    res.json({status:err.status, message:err.message, statuscode:err.statusCode})

})

app.listen(3000, (err)=>{
    console.log("server is listning o port 3000...")
})