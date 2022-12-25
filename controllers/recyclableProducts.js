const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Collect = require("../models/Collect");
const Partner = require("../models/Partner");
const RecyclableProduct = require("../models/RecyclableProduct");
const Plastic_type = require("../models/Plastic_type");

//@description:     Get recyclable products
//@ route:          GET /krysto/api/v1/recyclableProducts
//@ route:          GET /krysto/api/v1/partners/:partnerId/recyclableProducts
//@ route:          GET /krysto/api/v1/plasticTypes/:plasticTypeId/recyclableProducts
//@access:          Public

exports.getRecyclableProsducts = asyncHandler(async (req, res, next) => {
  if (req.params.partnerId) {
    const recyclableProducts = await RecyclableProduct.find({
      partner: req.params.partnerId,
    });
    return res.status(200).json({
      success: true,
      count: recyclableProducts.length,
      data: recyclableProducts,
    });
  } else if (req.params.plasticTypeId) {
    const recyclableProducts = await Plastic_type.find({
      plastycType: req.params.plasticTypeId,
    });
    return res.status(200).json({
      success: true,
      count: recyclableProducts.length,
      data: recyclableProducts,
    });
  } else {
    res.status(200).status(200).json(res.advancedResults);
  }
});

//@description:     Get single recyclable product
//@ route:          GET /krysto/api/v1/recyclableProducts/:id
//@access:          Public

exports.getRecyclableProduct = asyncHandler(async (req, res, next) => {
  const recyclableProduct = await RecyclableProduct.findById(
    req.params.id
  )

  if (!recyclableProduct) {
    return next(
      new ErrorResponse(
        `No recyclable product found with the id of ${req.params.id}`
      ),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: recyclableProduct,
  });
});

//@description:     Add recyclable product
//@ route:          POST /krysto/api/v1/recyclableProducts

//@access:          Private

exports.addRecyclableProducts = asyncHandler(async (req, res, next) => {

    const recyclableProduct = await RecyclableProduct.create(req.body);

    res.status(200).json({
      success: true,
      data: recyclableProduct,
    });
  

});

//@description:     Update recyclable product
//@ route:          PUT /krysto/api/v1/recyclableProducts/:id
//@access:          Private

exports.updateRecyclableProduct = asyncHandler(async (req, res, next) => {
  let recyclableProduct = await RecyclableProduct.findById(req.params.id);

  if (!recyclableProduct) {
    return next(
      new ErrorResponse(`No recyclable product with the id of ${req.params.id}`),
      404
    );
  }

    recyclableProduct = await RecyclableProduct.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: recyclableProduct,
  });
});
//@description:     Delete recyclable product
//@ route:          DELETE /krysto/api/v1/recyclableProducts/:id
//@access:          Private

exports.deleteRecyclableProducts = asyncHandler(async (req, res, next) => {
  const recyclableProduct = await RecyclableProduct.findById(req.params.id);

  if (!recyclableProduct) {
    return next(
      new ErrorResponse(`No recyclable product with the id of ${req.params.id}`),
      404
    );
  }
  await recyclableProduct.remove;

  res.status(200).json({
    success: true,
    data: {},
  });
});







// @desc      Upload photo for recyclable product 
// @route     PUT /api/v1/recyclableProducts/:id/photo
// @access    Private
exports.recyclableProductsPhotoUpload = asyncHandler(async (req, res, next) => {
    const recyclableProduct = await RecyclableProduct.findById(req.params.id);
  
    if (!recyclableProduct) {
      return next(
        new ErrorResponse(`recyclablel product not found with id of ${req.params.id}`, 404)
      );
    }
  
  
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
    const file = req.files.file;
    console.log(file);
    
  
  
     // Make sure the image is a photo
     if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }
  
    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  
  
    // Create custom filename
    file.name = `recyclable_product_photo_${recyclableProduct._id}${path.parse(file.name).ext}`;
  
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
  
      await RecyclableProduct.findByIdAndUpdate(req.params.id, { photo: file.name });
  
      res.status(200).json({
        success: true,
        data: file.name,
      });
    });
  });