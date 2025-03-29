import asyncHandler  from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req,res) => {

     const {username, email, fullName, password} = req.body

     // console.log("username : ", username );
     // console.log("email    : ", email );
     // console.log("fullName : ", fullName );
     // console.log("password : ", password );

     // if(username == ""){
     //      throw new ApiError(400, "username is required")
     // }         
     // if(email == ""){
     //      throw new ApiError(400, "email is required")
     // }
     // if(fullName == ""){
     //      throw new ApiError(400, "fullname is required")
     // }
     // if(password == ""){
     //      throw new ApiError(400, "password isrequired")
     // }

     if(
          [username, email, fullName, password].some((field) => field?.trim() === "")
     ){
          throw new ApiError(400, "All Fields are Required !")
     }

     const existingUser = await User.findOne(
          {
               $or : [{username}, {email}]
          }
     )
     if(existingUser){
          if(existingUser.username === username){
               throw new ApiError(409, "username  allready exists !")
          }else{
               throw new ApiError(409, "email allready exists !")
          }
     }

     const avatarLocalPath = req.files?.avatar[0]?.path;
     const coverImageLocalPath = req.files?.coverImage[0]?.path;

     if(!avatarLocalPath){
          throw new ApiError(400, "Avatar file is required ")
     }


     const avatar = await uploadCloudinary(avatarLocalPath)
     const coverImage = await uploadCloudinary(coverImageLocalPath)

     if(!avatar){
          throw new ApiError(400, "Avatar file is required ")
     }


     const user = await User.create(
          {
               username: username.toLowerCase(),
               email,
               fullName,
               password,
               avatar : avatar.url,
               coverImage :coverImage?.url || ""
          }
     )

     const createdUser = await User
                                   .findById(user._id)
                                   .select("-password -refreshToken")
     
     if(!createdUser){
          throw new ApiError(500, "Something went to Wrong While registering the user")
     }

     return res.status(2001).json(
          new ApiResponse(200, createdUser, "User Regester Successfully !")
     )
})

export  {registerUser}