
import cloudinary from "cloudinary";
import fs from "fs";
import { config } from "dotenv";
config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


class Cloudinary {
    
    constructor(file) {
        this.file = file;
    }

    async upload(folder) {

        //get file path
        const { path } = this.file;

        const mediaPromise = await new Promise(resolve  => {
            cloudinary.uploader.upload(path, (result) => {
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                    format: result.format,
                    resource_type: result.resource_type,
                })
            }, {
                resource_type: "auto",
                folder: folder
            });
            
        }).catch((error) => {
            console.log(error, "erro")
            return {
                status: 500,
                message: "You have an error while uploading a file to cloudinary",
                hint: error.message == undefined ? error : error.message
            };
        });

        //Unlink the temporary file path
        fs.unlinkSync(path);

        return {
            status: 200,
            fileInfo: mediaPromise
        };
    }

    async update(folder, oldFile) {
        //Remove old file 
        await this.delete(oldFile);
            
        //Add new file
        return await this.upload(folder);
    }

    async delete(oldFile) {
        await cloudinary.uploader.destroy(oldFile, (result) => {
             return result; 
        });
    }

}


export default Cloudinary;