const express = require("express");
const product = require("./routes/productRoute");
const dotenv = require("dotenv");
const databaseConnect = require("./database/connect");
const errorHandler = require("./middleware/errorMiddleware")
dotenv.config({path:"backend/config/config.env"});



const app = express();
databaseConnect(process.env.URL);


process.on('uncaughtExceptionMonitor', (err) => {
    console.log(`Uncaught Exception Error: ${err.message}` );
    console.log(`Closing Server due to uncaught exception..`);
    process.exit(1);
}
    )

app.use(express.json());
app.use('/api/v1',product);

app.get("/",(req,res)=>{
    res.send("<h1>Ecommerce website</h1>")
})

app.all('/favicon.ico', (req, res) => res.status(204).end());

app.all("*",(req,res,next)=>{
    console.log(req.url);
    const err = new Error("Route not found");
    err.status = "Fail";
    err.statusCode = "500";
    next(err);
})

app.use(errorHandler);


const server = app.listen(process.env.PORT, (err)=>{
    console.log(`server is listening on port ${process.env.PORT}...`)
})

process.on('unhandledRejection', (err)=>{
    console.log(`unhandle rejection: ${err.message}`);
    console.log(`CLosing Server due to unhandle promise rejection..`);
    server.close(()=>{
        process.exit(1);
    })

    
});