import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const tempUserSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
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
    verified : {
        type : Boolean,
        default : false
    }    
},{timestamps:true})

tempUserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

// tempUserSchema.methods.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password,this.password)
// }


export const TempUser = mongoose.model("TempUser",tempUserSchema)