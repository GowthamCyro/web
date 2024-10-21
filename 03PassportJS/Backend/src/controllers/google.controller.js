import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {User,TempUser} from "../models/index.js";
import {ApiResponse} from "../utils/ApiResponse.js";

import passport from "passport";

const googleAuthorize = async() => {
    console.log('Google');
    passport.authenticate("google", { scope: ["profile", "email"] });
} 

// const googleCallback = async() => {
//     passport.authenticate("google", {
//         successRedirect: process.env.CLIENT_URL || "http://localhost:5173",  
//         failureRedirect: "/login/failed",  
//     })
// }

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

const googleCallback = (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, user, info) => {
        if (err || !user) {
            return res.redirect("/socialSign/login/failed");
        }
        try {
            const { displayName, emails, photos } = user;
            const tempUsername = `google_${Date.now()}`; // Temporary username using a timestamp or UUID

            const existedUser = await User.findOne({
                email: emails[0].value,
            });

            let createdUser = {};
            if (!existedUser) {
                const password = await User.makeEncryption("empty");
                const newUser = await User.create({
                    fullName: displayName,
                    avatar: {
                        url: photos[0].value,
                    },
                    email: emails[0].value,
                    password: password,  // Initially empty password
                    username: tempUsername, // Temporary username
                    verified: true,
                });

                createdUser = await User.findById(newUser._id).select("-password");

                if (!createdUser) {
                    throw new ApiError(501, "Something went wrong while creating the user");
                }

                const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(createdUser._id);
                const options = {
                    httpOnly: true,
                    // secure: true  Use when HTTPS is available
                };
                return res
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/google`);
            } 
            else {
                createdUser = existedUser;
                const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(createdUser._id);
                const options = {
                    httpOnly: true,
                    // secure: true  
                };
                return res
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}`);
            }

        } catch (error) {
            next(error); // Pass the error to the error-handling middleware
        }
    })(req, res, next);
};

const detailsUpdate = asyncHandler (async(req,res) => {

    console.log('details getting updated successfully');

    const {username,password} = req.body;

    if(!username && !password ){
        throw new ApiError(401,"Values cannot be empty to update");
    }

    const updateFeilds = {}

    if(username) updateFeilds.username = username;
    if(password) updateFeilds.password = await User.makeEncryption(password);

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : updateFeilds
        },
        {
            new : true
        }
    ).select("-password")

    if(!user){
        throw new ApiError(501,"User Not Found to Update Details");
    }

    return res.status(200)
    .json(new ApiResponse(200,user,"Account Details Updated Successfully"));

})

// const registerUser = asyncHandler( async (req,res) => {

//         // get user details from google
//         // check if user already exists 
//         // check what values are provided to you
//         // check for images, check for avatar
//         // upload avatar and coverImage and wait for status
//         // save the user object in db
//         // remove refreshToken and password in response
//         // check for user creation
//         // return response

//     const {fullName,username,email,password} = req.body

//     if([fullName,email,username,password].some((feild) => feild?.trim() === "")){
//         throw new ApiError(400,"Values should not be empty")
//     }

//     const existedUser = await User.findOne({
//         $or : [{ username },{ email }]
//     })

//     if(existedUser){
//         throw new ApiError(400,"User already Exists");
//     }

//     const avatarLocalPath = req.files?.avatar[0]?.path;
//     //const coverImageLocalPath = req.files?.coverImage[0]?.path;

//     let coverImageLocalPath;
//     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//         coverImageLocalPath = req.files.coverImage[0].path
//     }

//     if(!avatarLocalPath){
//         throw new ApiError(400,"Avatar File is required");
//     }

//     const avatar = await uploadOnCloudinary(avatarLocalPath);
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath);

//     if(!avatar){
//         throw new ApiError(400,"Image did not uploaded successfully to cloudinary! Please try again !");
//     }

//     const user = await TempUser.create({
//         fullName,
//         avatar : {
//             public_id : avatar.public_id,
//             url : avatar?.url
//         },
//         coverImage: {
//             public_id : coverImage?.public_id || "",
//             url : coverImage?.url || ""
//         },
//         email,
//         password,
//         username : username.toLowerCase()
//     })

//     const createdUser = await TempUser.findById(user._id).select("-password");

//     if(!createdUser){
//         throw new ApiError(501,"Something went wrong while creating the user");
//     }
    
//     const token = await new Token({
//         userId : createdUser._id,
//         token : crypto.randomBytes(32).toString("hex")
//     }).save();

//     const url = `${process.env.BASE_URL}/users/${createdUser._id}/verify/${token.token}`;
//     await sendMail(createdUser.email,"Email Verification",url, createdUser._id);

//     await delay(5000);

//     const emailStatus = await checkEmailBounce(createdUser.email, createdUser._id);
//     if (emailStatus) {
//         await TempUser.deleteOne({_id : createdUser._id});
//         throw new ApiError(401, "Email does not exist, please provide a valid email.");
//     } else {
//         return res.status(201).json(
//             new ApiResponse(200, createdUser, "Verification link sent to the email! Please verify.")
//         );
//     }
// })

// const loginUser = asyncHandler( async(req,res) => {
//     // req data
//     // username or email
//     // get the user
//     // check the password
//     // give access and refresh token
//     // send secure cookies

//     const {email,password} = req.body;
//     if(!email || !password){
//         throw new ApiError(400,"Email and password is mandatory to login");
//     }

//     const user = await User.findOne({email});

//     if(!user){
//         throw new ApiError(404,"User not Found!! Please Register")
//     }

//     if(!user.verified){
//         let token = await Token.findOne({userId : user._id})
//         if(!token){
//             const token = await new Token({
//                 userId : user._id,
//                 token : crypto.randomBytes(32).toString("hex")
//             }).save();
        
//             const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
//             await sendMail(user.email,"Email Verification",url);
//         }
//         return res.status(400).json(
//             new ApiResponse(200,{},"Verification Link send to the email ! Please Verify !!")
//         );
//     }

//     const isPasswordValid = await user.isPasswordCorrect(password)

//     if(!isPasswordValid){
//         throw new ApiError(401,"Password Incorrect!! Invalid User credentials");
//     }

//     const { accessToken,refreshToken } = await generateAccessAndRefreshTokens(user._id);

//     const loggedInUser = await User.findById(user._id).select("-password -refershToken"); // again calling data base because user reference has no referesh token

//     const options = {
//         httpOnly : true,
//         // secure : true  # will be used only when in https not localhost
//     }
//     return res
//     .status(200)
//     .cookie("accessToken",accessToken,options)
//     .cookie("refreshToken",refreshToken,options)
//     .json(
//         new ApiResponse(200,
//             {
//                 user : loggedInUser,accessToken,refreshToken
//             },
//             "User LoggedIn Successfully"
//         )
//     )
// })

const loginSuccess = asyncHandler( async(req,res) => {
    if (req.user) {
        res.status(200).json({
          success: true,
          message: "successful",
          user: req.user,
        });
      } else {
        res.status(403).json({ success: false, message: "Not authenticated" });
      }
})

const loginFailed = asyncHandler( async(req,res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
})

export{
    googleAuthorize,
    googleCallback,
    loginSuccess,
    loginFailed,
    detailsUpdate
}