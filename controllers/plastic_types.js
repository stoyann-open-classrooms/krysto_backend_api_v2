const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Plastic_type = require("../models/Plastic_type");

//@description:     Get all plastic Types
//@ route:          GET /krysto/api/v1/plasticTypes
//@access:          Public
exports.getPlasticTypes = asyncHandler(async (req, res, next) => {
 
  res
    .status(200)
    .json(res.advancedResults);
});

//@description:     Get a single plastic type
//@ route:          GET /krysto/api/v1/plasticType/:id
//@access:          Public
exports.getPlasticType = asyncHandler(async (req, res, next) => {
  const plasticType = await Plastic_type.findById(req.params.id);
  if (!plasticType) {
    return next(
      new ErrorResponse(`Article not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: plasticType });
});

//@description:     Create a plastic type
//@ route:          POST /krysto/api/v1/plasticTypes
//@access:          Private
exports.createPlasticType = asyncHandler(async (req, res, next) => {
  const plastic_type = await Plastic_type.create(req.body);
  res.status(201).json({
    success: true,
    data: plastic_type,
  });
});

//@description:     Update a plastic type
//@ route:          PUT /krysto/api/v1/plasticTypes/:id
//@access:          Private
exports.updatePlasticType = asyncHandler(async (req, res, next) => {
  const plasticType = await Plastic_type.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!plasticType) {
    return next(
      new ErrorResponse(`Plastic type not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: plasticType });
});

//@description:     Delete a plastic type
//@ route:          DELETE /krysto/api/v1/plasticTypes/:id
//@access:          Private
exports.deletePlasticType = asyncHandler(async (req, res, next) => {
  const plasticType = await Plastic_type.findByIdAndDelete(req.params.id);
  if (!plasticType) {
    return next(
      new ErrorResponse(`Plastic type not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});


// @desc      Upload photo for plastic type
// @route     PUT /api/v2/plasticTypes/:id/photo
// @access    Private
exports.plasticTypePhotoUpload = asyncHandler(async (req, res, next) => {
  const plasticType = await Plastic_type.findById(req.params.id);

  if (!plasticType) {
    return next(
      new ErrorResponse(`plastic type not found with id of ${req.params.id}`, 404)
    );
  }
 
//   // Make sure user is user owner
//   if (user.toString() !== req.user.id && req.user.role !== 'admin') {
//     return next(
//       new ErrorResponse(
//         `user ${req.params.id} is not authorized to update this collect point`,
//         401
//       )
//     );
//   }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;
 

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
  file.name = `plastic_logo_${plasticType.identifier}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Plastic_type.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});


