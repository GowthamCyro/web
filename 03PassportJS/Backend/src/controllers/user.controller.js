import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User,Token, TempUser} from "../models/index.js";
import {deleteOnCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import {sendMail,checkEmailBounce} from "../utils/sendMail.js";
import crypto from "crypto";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return { accessToken,refreshToken }

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access tokens");
    }
}

const verifyEmail = asyncHandler( async(req,res) =>  {
    const tempUser = await TempUser.findById(req.params.id);

    if(!tempUser){
        throw new ApiError(401,"User Not Exist ! Invalid Link");
    }

    const token = await Token.findOne({
        userId : tempUser._id,
        token : req.params.token
    })

    if(!token){
        throw new ApiError(401,"Token Not Exist ! Invalid Link");
    }

    const user = await User.create({
        fullName: tempUser.fullName,
        username: tempUser.username,
        email: tempUser.email,
        password: tempUser.password,
        avatar : {
            public_id : tempUser.avatar.public_id,
            url : tempUser.avatar.url
        },
        coverImage: {
            public_id : tempUser.coverImage.public_id || "",
            url : tempUser.coverImage.url || ""
        },
        verified : true
    });

    await token.deleteOne()
    await tempUser.deleteOne();


    return res.status(200)
    .json(
        new ApiResponse(200,{},"Email Verified Successfully")
    )
})

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
        throw new ApiError(400,"User already Exists");
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

    const user = await TempUser.create({
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

    const createdUser = await TempUser.findById(user._id).select("-password");

    if(!createdUser){
        throw new ApiError(501,"Something went wrong while creating the user");
    }
    
    const token = await new Token({
        userId : createdUser._id,
        token : crypto.randomBytes(32).toString("hex")
    }).save();

    const url = `${process.env.BASE_URL}/users/${createdUser._id}/verify/${token.token}`;
    await sendMail(createdUser.email,"Email Verification",url, createdUser._id);

    await delay(5000);

    const emailStatus = await checkEmailBounce(createdUser.email, createdUser._id);
    if (emailStatus) {
        await TempUser.deleteOne({_id : createdUser._id});
        throw new ApiError(401, "Email does not exist, please provide a valid email.");
    } else {
        return res.status(201).json(
            new ApiResponse(200, createdUser, "Verification link sent to the email! Please verify.")
        );
    }
})

const forgotPasswordEmail = asyncHandler( async(req,res) => {

    // First user should click on start recovery so that he or she will hit this service
    // from this service we will send a email to the user 
    // the user clicks the url on the mail
    /* should redirec to the frontend page where he/she will give newPassword and confirm password 
    and make sure that the link expires in some 15mins*/ 
    // when the user clicks the submit then it should hit new service which changes the password.

    const {email} = req.body;

    const user = await User.findOne({ email : email })

    if(!user){
        throw new ApiError(401,"User Not Found");
    }

    let token = await Token.findOne({ userId : user._id })

    if(!token){
        token = await new Token({
            userId : user._id,
            token : crypto.randomBytes(32).toString("hex")
        }).save();
    }

    const url = `${process.env.BASE_URL}/users/forgotPassword/${token.token}`;
    await sendMail(user.email,"Email Verification",url, user._id);

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Email Send Successfully to Change the password")
    )

})

const forgotPassword = asyncHandler(async(req,res) => {
    const token = req.params.token;
    const {newPassword} = req.body;

    console.log(token);
    console.log(newPassword);

    const userToken = await Token.findOne({token : token});
    if(!userToken){
        throw new ApiError(404,"Invalid Token ! Please Try Again");
    }

    const user = await User.findById({_id : userToken.userId});

    if(!user){
        throw new ApiError(401,"User Not Found");
    }

    const password = await User.makeEncryption(newPassword);
    console.log(password);

    const updatedUser = await User.findByIdAndUpdate({_id : userToken.userId},
        {
            password : password
        },
        {
            new : true
        }
    )

    if(!updatedUser){
        throw new ApiError(501,"Something went wrong while updating the password!");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedUser,"Password Updated Successfully")
    )
})

const loginUser = asyncHandler( async(req,res) => {
    // req data
    // username or email
    // get the user
    // check the password
    // give access and refresh token
    // send secure cookies

    const {email,password} = req.body;
    if(!email || !password){
        throw new ApiError(400,"Email and password is mandatory to login");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404,"User not Found!! Please Register")
    }

    if(!user.verified){
        let token = await Token.findOne({userId : user._id})
        if(!token){
            const token = await new Token({
                userId : user._id,
                token : crypto.randomBytes(32).toString("hex")
            }).save();
        
            const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
            await sendMail(user.email,"Email Verification",url);
        }
        return res.status(400).json(
            new ApiResponse(200,{},"Verification Link send to the email ! Please Verify !!")
        );
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Password Incorrect!! Invalid User credentials");
    }

    const { accessToken,refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refershToken"); // again calling data base because user reference has no referesh token

    const options = {
        httpOnly : true,
        // secure : true  # will be used only when in https not localhost
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                user : loggedInUser,accessToken,refreshToken
            },
            "User LoggedIn Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true
    }

    return res.
    status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User LoggedOut Successfully")
    )
})

const refreshAccessToken = asyncHandler( async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token");
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refreshed Token is expired or used")
        }
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(200,{accessToken,refreshToken},"AccessToken Refreshed Successfully")
        )
    } catch (error) {
        throw new ApiError(401,"Invalid Refresh Token");
    }
})

const changeCurrentPassword = asyncHandler( async(req,res) => {
    const {oldPassword,newPassword} = req.body

    if(!oldPassword || !newPassword){
        throw new ApiError(401,"Values should be given");
    }
    const user = await User.findById(req.user?._id);
    const isCorrectPassword = await user.isPasswordCorrect(oldPassword);

    if(!isCorrectPassword){
        throw new ApiError(401,'Invalid old Password')
    }

    user.password = newPassword 
    await user.save({validateBeforeSave : false})

    return res.status(200)
    .json(
        new ApiResponse(200,{},"Password Updated Successfully")
    )
})

const getCurrentUser = asyncHandler ( async(req,res) => {
    return res.status(200)
    .json(
        new ApiResponse(200,req.user,"Current User Fecteched Successfully")
    )
})

const updateAccountDetails = asyncHandler (async(req,res) => {

    const {username,fullName,email} = req.body

    if(!fullName && !email && !username){
        throw new ApiError(401,"Values cannot be empty to update");
    }

    const updateFeilds = {}

    if(username) updateFeilds.username = username;
    if(fullName) updateFeilds.fullName = fullName;
    if(email) updateFeilds.email = email;
 
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : updateFeilds
        },
        {
            new : true
        }
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"Account Details Updated Successfully"))

})

const updateUserAvatar = asyncHandler( async(req,res) => {
    const avatarFilePath = req.file?.path;
    const deleteAvatar = req.user?.avatar?.public_id;

    if(!avatarFilePath){
        throw new ApiError(401,"Avatar file not uploaded Successfully");
    }

    const avatar = await uploadOnCloudinary(avatarFilePath)

    if(!avatar.url){
        throw new ApiError(401,"Avatar file not uploaded Successfully into Cloudinary");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                avatar : {
                    public_id : avatar.public_id,
                    url : avatar.url
                }
            }
        },
        {
            new : true
        }
    ).select("-password")

    if(deleteAvatar && user.avatar.public_id){
        await deleteOnCloudinary(deleteAvatar);
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const updateUserCoverImage = asyncHandler( async(req,res) => {
    const coverImageFilePath = req.file?.path;
    const deleteCoverImage = req.user?.coverImage?.public_id;

    if(!coverImageFilePath){
        throw new ApiError(401,"Avatar file not uploaded Successfully");
    }

    const coverImage = await uploadOnCloudinary(coverImageFilePath);

    if(!coverImage.url){
        throw new ApiError(401,"Avatar file not uploaded Successfully into Cloudinary");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                coverImage : {
                    public_id : coverImage.public_id,
                    url : coverImage.url
                }
            }
        },
        {
            new : true
        }
    ).select("-password")

    if(deleteCoverImage && user.coverImage.public_id){
        await deleteOnCloudinary(deleteCoverImage);
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover Image updated successfully")
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    verifyEmail,
    generateAccessAndRefreshTokens,
    forgotPasswordEmail,
    forgotPassword
}