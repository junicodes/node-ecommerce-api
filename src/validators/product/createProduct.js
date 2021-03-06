import { response } from 'express';
import * as yup from 'yup';
import Product from '../../models/Product';
import fs from "fs";

// Just like before, without the id field
export const createProductSchema = yup.object({
  title: yup.string().required(),
  desc: yup.string().required(),
  categories: yup.string().required(),
  sizes: yup.string(),
  colors: yup.string(),
  price: yup.string().required(),
  currency: yup.string().required()
});

export const validateUniqueTitle = async (req, res, next) => {
  const check = await Product.findOne({ title: req.body.title}).exec();
    
  if(check) {
    //Unlink file from temporary storage
    const { path } = req.file
    fs.unlinkSync(path);

    return res.status(400).json({
      error: "Product with Title already exist"
    });
  }
  next();
}

export const validateUpdateUniqueTitle = async (req, res, next) => {
  const { id } = req.params;
  
  const check = await Product.findOne({ title: req.body.title});

  if(check && check.id !== id) {
    //Unlink file from temporary storage
    const { path } = req.file;
    fs.unlinkSync(path);

    return res.status(400).json({
      error: "Product with title already exist"
    });
  }
  next();
}