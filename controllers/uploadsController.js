const path = require('path');
const fs = require('fs');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;

const uploadProductImageLocal = async (req, res) => {
  // check if the file exists
  if (!req.files) {
    throw new CustomError.BadRequestError('No file uploaded');
  }

  const productImage = req.files.image;

  // check format
  if (productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload the Image');
  }

  // check size
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'the image is oversized, please upload smaller than 1KB size image '
    );
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'file-upload',
    }
  );
  // console.log(result);
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadProductImage,
};
