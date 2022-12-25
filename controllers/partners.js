const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
const Partner = require("../models/Partner");

//@description:     Get all partners
//@ route:          GET /krysto/api/v1/partners
//@access:          Public
exports.getPartners = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@description:     Get a single partner
//@ route:          GET /krysto/api/v1/partners/:id
//@access:          Public
exports.getPartner = asyncHandler(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) {
    return next(
      new ErrorResponse(`Partner not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: partner });
});

//@description:     Create new partner
//@ route:          POST /krysto/api/v1/partners
//@access:          Private
exports.createPartner = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published partner
  const publishedPartner = await Partner.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one partner
  if (publishedPartner && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a partner`,
        400
      )
    );
  }j

  const partner = await Partner.create(req.body);
  res.status(201).json({
    success: true,
    data: partner,
  });
});

//@description:     Update a partner
//@ route:          PUT /krysto/api/v1/partners/:id
//@access:          Private
exports.updatePartner = asyncHandler(async (req, res, next) => {
  let partner = await Partner.findById(req.params.id, req.body);
  if (!partner) {
    return next(
      new ErrorResponse(`Partner not found with ID of ${req.params.id}`, 404)
    );
  }
  

  // Make sure user is partner owner
  if (partner.user.toString() !== req.user.id && req.user.role !== admin) {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} is not authorize to update this partner`,
        401
      )
    );
  }

  partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: partner });
});

//@description:     Delete a partner
//@ route:          DELETE /krysto/api/v1/partners/:id
//@access:          Private
exports.deletePartner = asyncHandler(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return next(
      new ErrorResponse(`Partner not found with ID of ${req.params.id}`, 404)
    );
  }

  // Make sure user is partner owner
  if (partner.user.toString() !== req.user.id && req.user.role !== admin) {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} is not authorize to update this partner`,
        401
      )
    );
  }

  partner.remove();

  res.status(200).json({ success: true, data: {} });
});

// @description      Get partners within a radius
// @route            GET /api/v1/partners/radius/:zipcode/:distance
// @access           Private
exports.getPartnersInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius =  6,378 km
  const radius = distance / 6378;

  const partners = await Partner.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: partners.length,
    data: partners,
  });
});

// @desc      Upload photo for partner
// @route     PUT /api/v1/partners/:id/photo
// @access    Private
exports.partnerPhotoUpload = asyncHandler(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return next(
      new ErrorResponse(`Partner not found with id of ${req.params.id}`, 404)
    );
  }

  // // Make sure user is partner owner
  // if (partner.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `user ${req.params.id} is not authorized to update this partner`,
  //       401
  //     )
  //   );
  // }

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
  file.name = `photo_${partner._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Partner.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
