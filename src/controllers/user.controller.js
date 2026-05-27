import { asyncHandler } from "../utils/asyncHandler.js";
import {APIerror} from "../utils/APIerror.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { APIresponse } from "../utils/APIresponse.js";


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
    console.log("email ",email);

    if(
        [fullName,email,username,password].some((feild) => feild?.trim() === "")
    ){
        throw new APIerror(400,"all feilds are required")
    }

    const existedUser = User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new APIerror(409,"user with username or email already exists")
    }

    const avatarLocalPath = req.file?.avatar[0]?.path;
    const coverImageLocalPath = req.file?.coverImage[0]?.path;

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
        coverImage:coverImage.url || "",
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


export {registerUser}