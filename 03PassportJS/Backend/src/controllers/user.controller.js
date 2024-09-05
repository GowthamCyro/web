import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req,res) => {

    // get user details from the front end
        // check whether all the values are given
        // check if user already exists 
        // check for images, check for avatar
        // upload avatar and coverImage and wait for status
        // save the user object in db
        // remove refreshToken and password in response
        // check for user creation
        // return response

    const {fullName,username,email,password} = req.body

    if([fullName,email,username,password].some((feild) => feild?.trim() === "")){
        throw new ApiError(400,"Values should not be empty")
    }

    const existedUser = await User.findOne({
        $or : [{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409,"User already Exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar File is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Image did not uploaded successfully to cloudinary! Please try again !");
    }

    const user = await User.create({
        fullName,
        avatar : {
            public_id : avatar.public_id,
            url : avatar?.url
        },
        coverImage: {
            public_id : coverImage?.public_id || "",
            url : coverImage?.url || ""
        },
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(501,"Something went wrong while creating the user");
    }
    
    return res.status(201).json(
        new ApiResponse(200,createdUser,"New User Registered Successfully")
    );
})

export {registerUser}