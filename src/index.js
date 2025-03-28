import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js"


dotenv.config({
    path: './.env'
})


const PORT = process.env.PORT || 8000

connectDB()
.then((() =>{
    app.listen(`Server running at port : ${PORT}`)
}))
.catch((error) => {
    console.log("MongoDb connection faild !! : ", error);
})






















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