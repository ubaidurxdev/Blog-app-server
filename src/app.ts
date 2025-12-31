import express, { Application } from "express";

const app: Application = express();


app.use('/',async(req,res)=>{
    res.send('hello world')
})
export default app;
