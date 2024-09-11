import mongoose, { Schema } from "mongoose";


const tokenSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    },
    token : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 3600
    }
})

export const Token = mongoose.model("Token",tokenSchema)