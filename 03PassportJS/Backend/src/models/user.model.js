import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    fullName : {
        type : String,
        required : true,
        trim : true
    },
    avatar : {
        type : {
            public_id : String,
            url : String
        },
        required : true
    },
    coverImage : {
        type : {
            public_id : String,
            url : String
        }
    },
    password : {
        type : String,
        required : true
    },
    refreshToken : {
        type : String
    },
    verified : {
        type : Boolean,
        default : false
    }    
},{timestamps:true})

// userSchema.pre("save", async function (next) {
//     if(!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password,10)
//     next()
// })

userSchema.statics.makeEncryption = async function (password) {
    return bcrypt.hash(password,10)
}

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id : this._id
        }
        ,
        process.env.REFRESH_TOKEN_SECRET
        ,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)