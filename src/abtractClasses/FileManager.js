

import Cloudinary from "../services/Cloudinary";
import ImageKit   from "../services/ImageKit";


class FileManager {

    constructor(service, file) {
        this.service = service;
        this.cloudinary = new Cloudinary(file);
        this.imageKit = new ImageKit(file);
    }

    //For Images 
    upload(folder) {
        if(this.service === "cloudinary") {
            return this.cloudinary.upload(folder);
        }
        if(this.service === "imagekit") {
            return this.imageKit.upload(folder);
        }
    }

    update(folder, oldFile) {
        if(this.service === "cloudinary") {
            return this.cloudinary.update(folder, oldFile);
        }
        if(this.service === "imagekit") {
            return this.imageKit.update(folder, oldFile);
        }
    }

    delete(folder, oldFile) {
        if(this.service === "cloudinary") {
            return this.cloudinary.delete(folder, oldFile);
        }
        if(this.service === "imagekit") {
            return this.imageKit.delete(folder, oldFile);
        }
    }

}


export default  FileManager;