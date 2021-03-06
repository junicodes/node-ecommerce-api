import User from "../models/User";
import Product from "../models/Product";
import FileManager from "../abtractClasses/FileManager";
const { PaginationParameters } = require('mongoose-paginate-v2');

export const getOne = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        res.status(200).json({
            message: "Product account found succesfully!",
            data: product._doc
        });

    } catch (error) {
         res.status(500).json(error.message);
    }
};

export const getAll = async (req, res) => {

  const options = {
    // select: 'title date author',
    sort: { _id: -1 },
    lean: true,
    allowDiskUse: true,
    forceCountFn: true,
  };

  req.query = {...req.query, ...options};

  try {
    let product = [];

    if(req.query.categories) {
      product = await Product.paginate({
        categories: {
          $in: [req.query.categories]
        }
      }).then((result) => result );
    }else {
      product = await Product.paginate(...new PaginationPara  meters(req).get()).then((result) => result );
    }

    res.status(200).json({
        message: "All product found!",
        data: product
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const create = async (req, res) => {

    const folder = "market-line/file-media/products";

    try { 

      //get The File upload Manageer
      const fileUpload = new FileManager(process.env.MEDIA_STORAGE_SERVICE, req.file); //indicate the service type for upload (check .env file)

      //Perform Upload
      const {status, message, hint, fileInfo} = await fileUpload.upload(folder);

      if(status != 200) {
        res.status(status).json({status, message, hint});
      }

      //Add File path to request body before save
      req.body.image = fileInfo;

      //Modilfy req body 

      req.body.categories = req.body.categories.replace(/\s/g, "").split(",");
      req.body.sizes = req.body.sizes.split(",");
      req.body.colors = req.body.colors.split(",");

      //Save to Database
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();

      res.status(200).json({
        message: "Product created succesfully!",
        data: savedProduct
      });

    } catch (error) {
      res.status(500).json(error.message);
    }
}


export const update = async (req, res) => {
  
  const folder = "market-line/file-media/products";

  try {

    //Update the file image 

    if(req.file) {

      //get The File upload Manageer
      const fileUpload = new FileManager(process.env.MEDIA_STORAGE_SERVICE, req.file); //indicate the service type for upload (check .env file)

      //Get Old File from the Database
      const $oldFile = await Product.findById({_id: req.params.id});

      const {status, message, hint, fileInfo} = await fileUpload.update(folder, $oldFile.image.public_id);

      if(status != 200) {
        res.status(status).json({status, message, hint});
      }

      req.body.image = fileInfo;
    }


    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Product updated succesfully!",
      data: updateProduct
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const destroy = async (req, res) => {
  
    try {
        //Delete a file image 

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Product account deleted succesfully!"
        });

    } catch (error) {
         res.status(500).json(error.message);
    }
}