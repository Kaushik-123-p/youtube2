import dotenv from "dotenv"
import connectDB from "./db/index.js";


dotenv.config({
    path: './.env'
})


connectDB()






















// import mongoose from 'mongoose'
// import { DB_NAME } from './constants'

// import express from "express"
// const app = express()

// (async () =>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI }/${DB_NAME}`)
//         app.on("error" , (error)=>{
//             console.log("error", error);
//             throw error
//         })

//         app.listen(process.eventNames.PORT), () =>{
//             console.log(`App is listening at ${process.env.PORT}`);
//         }
//     }
//     catch (error){
//         console.error("EOROR : ",error)
//         throw error
//     }
// }) ()