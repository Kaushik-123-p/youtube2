
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import  app  from "./app.js";


dotenv.config({
    path: './.env'
})  


const PORT = process.env.PORT || 8008;

connectDB()
.then(() => {
    app.listen(PORT , () =>  {
        console.log(`Server is running at port : ${PORT}`);
    })
    
}).catch((err) => {
    console.log("Mongo DB connection faild !!", err);
});





















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