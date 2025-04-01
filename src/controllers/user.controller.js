import asyncHandler  from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/clouudinary.js"


const generateAccessAndRefreshToken = async (userId) => {
     try {
          const user = await User.findById(userId)
          const accessToken = user.generateAccessToken()
          const refreshToken = user.generateRefreshToken()

          user.refreshToken = refreshToken
          await user.save({validateBeforeSave : false})
          
          return (accessToken, refreshToken)
      } catch (error) {
          throw new ApiError(500, "Something Went TO Wrong While Generating Access and Refresh Toekn !!")
     }
}

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

     console.table(req.files)

     const avatarLocalPath = req.files?.avatar[0]?.path;
     // const coverImageLocalPath = req.files?.coverImage[0]?.path;

     let coverImageLocalPath;
     if(req.files  && Array.isArray(req.files.coverImage) && req.files.coverImage.length >  0){
          coverImageLocalPath = req.files.coverImage[0].path
     }

     if(!avatarLocalPath){
          throw new ApiError(400, "Avatar file is required ")
     }


     const avatar = await uploadOnCloudinary(avatarLocalPath)
     const coverImage = await uploadOnCloudinary(coverImageLocalPath)

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

     return res.status(200).json(
          new ApiResponse(200, createdUser, "User Regester Successfully !")
     )
})


const loginUser = asyncHandler ( async (req,res) => {


     const {username, email, password} = req.body;

     if(!username || !email){
          throw new ApiError(400, "username or email is required !")
     }

     const user = await User.findOne(
          {
               $or : [{username}, {email}]
          }
     )

     if(!user){
          throw new ApiError(404, "user does not exists !!  ")
     }

     const isPasswordValid = await user.isPasswordCorrect(password)

     if(!isPasswordValid){
          throw new ApiError(401, "Password is Invalid !")
     }

     const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

     const loggedInUser = await User.findById(user._id).select("-password refreshToken")

     const options = {
          httpOnly:true,
          secure : true
     }

     return res
               .status(200)
               .coookie("accessToken", accessToken, options)
               .coookie("refreshToken", refreshToken, options)
               .json(
                    new ApiResponse(
                         200,
                         {
                              user : loggedInUser, accessToken, refreshToken
                         },
                         "User logged In Successfully !"
                    )
               )
})


const logoutUser = asyncHandler ( async (req,res) => {
     await User.findByIdAndUpdate(
          req.user._id,
          {
            refreshToken : undefined
          },
          {
            new : true
          }
        )
      
        const options = {
          httpOnly : true,
          secure : true
         }
      
         return res 
         .status(200)
         .clearCookie("accessToken", options)
         .clearCookie("refreshToken", options)
         .json(
          new ApiResponse(
            200,
            {},
            "User Logged Out !"
          )
         )
      
})

export  {
          registerUser,
          loginUser,
          logoutUser
     }