import { asyncHandler } from "../utils/asyncHandler.js";
import {APIerror} from "../utils/APIerror.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { APIresponse } from "../utils/APIresponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try{

        const user = await User.findById(userId);
        const accessToken=User.generateAccessToken()
        const refreshToken=User.generateRefreshToken()

        user.refeshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    }catch(error){
        throw new APIerror(500,"something went wrong while creating access and refresh tokens")
    }
}

const registerUser= asyncHandler( async (req,res) => {
    // get user details from frontend
    // validation -> not empty
    // check if user already exist : username , email
    // check for images and coverimage
    // upload them to cloudinary
    // create user onject - create entry in db
    // remove password and refresh token feild from response
    // check for user creation
    // return response

    const {fullName , email , username , password} = req.body
    // console.log("email ",email);

    if(
        [fullName,email,username,password].some((feild) => feild?.trim() === "")
    ){
        throw new APIerror(400,"all feilds are required")
    }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new APIerror(409,"user with username or email already exists")
    }

    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){
        coverImageLocalPath=req.files.coverImage[0].path;
    }

    // we write this syntax of coverImageLocalPath instead of that above bcoz if we not give the cover image , then
    // error occur which is Cannot read properties of undefined. so to resove this error first we confirm that
    // all the necessary things exist , like coverImage array exist and its length > 0 , and then we take path

    if(!avatarLocalPath){
        throw new APIerror(400,"avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new APIerror(400,"avatar file is required");
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refeshToken")

    if(!createdUser){
        throw new APIerror(500,"something went wrong while registering the user")
    }

    return res.status(201).json(
        new APIresponse(200,createdUser,"User registered successfully")
    )
})

const loginUser=asyncHandler(async (req,res)=>{
    // req.body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const {email , username , password} = req.body;

    if(!(username || email)){
        throw new APIerror(400,"username or email is required")
    }

    const user = await User.findOne({
        $or:[{email},{username}]
    })

    if(!user){
        throw new APIerror(404,"user does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new APIerror(401,"password not valid");
    }

    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)

    const loggedInUser=await User.findById(user._id).select("-password -refeshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
    .json(new APIresponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged In successfully"
    ))
})

const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(req.user._id ,
        { $set: {
            refeshToken:undefined
        } 
    },
    {
        new:true
    }

)

const options = {
        httpOnly:true,
        secure:true
    }

    return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new APIresponse(200,{},"Usr logged out"))
})



export {registerUser , loginUser, logoutUser}