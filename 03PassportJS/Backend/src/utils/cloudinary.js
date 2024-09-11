import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import {v4 as uuidv4 } from 'uuid';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        const publicId = uuidv4();

        if(!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath,{
            public_id : publicId,
            resource_type : "auto"
        })

        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath);
    }
}

const deleteOnCloudinary = async (public_id,resource_type="image") => {
    try {
        if(!public_id) return null
    
        const response = await cloudinary.uploader.destroy(public_id,{
            resource_type : `${resource_type}`
        })
    } catch (error) {
        console.log("Delete on cloudinary Failed",error);
        return error
    }
}

export {
    uploadOnCloudinary,
    deleteOnCloudinary
}