import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
const app=express()
dotenv.config({
    path:'./env'
})
connectDB()

/*
( async () => {
    try{
        await mongoose.connect(`${process.env.MOGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR: ",error);
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`app is listening on port ${process.env.PORT}`);
        })
    }
    catch(err){
        console.log("ERROR: ",err);
        throw err
    }
})()
*/