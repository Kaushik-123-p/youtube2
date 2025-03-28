import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{

            // we usd cloudinary URL its like a AWS services where we can upload images ,files , etc and they gives URL ( A Cloudinary URL is a link to an image or video stored on Cloudinary, a cloud-based media management service. Cloudinary allows developers to upload, store, transform, and deliver images and videos efficiently. )

            type:String,    
            required:true
        },
        coverImage:{
            type:String
        },
        watchHistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"video"
            }
        ],
        password:{
            type:String,
            required:[true, "password is required"]
        },
        refteshToken:{

            // The refreshToken field is used in JWT authentication to store a long-lived token that helps users stay logged in without requiring them to enter credentials again.

            type:String
        }
    },
    {
        timestamps:true
    }
)

    userSchema.pre("save", async function (next) {
        if(!this.isModified(this.password)) return next()
            
            this.password = await bcrypt.hash(this.password, 10)
            next()
    })

    userSchema.methods.isPasswordCorrect = async function  (password) {
        return await bcrypt.compare(password, this.password)   
    }


    userSchema.methods.generateAccessToken = async function () {
      return  jwt.sign(
            {
                _id : this._id,
                username : this.username,
                email : this.email,
                fullName : this.fullName,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn : process.env.REFRESH_TOKEN_SECRET
            }
        )
    }

    userSchema.methods.generateRefreshToken = async function () {
       return jwt.sign(
            {
                _id: this._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    }





export const User = mongoose.model("User", userSchema)