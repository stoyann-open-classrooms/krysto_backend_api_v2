const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

const Article = require("../models/Article");

//@description:     Get all articles
//@ route:          GET /krysto/api/v1/articles
//@access:          Public
exports.getArticles = asyncHandler(async (req, res, next) => {
 
  res
    .status(200)
    .json(res.advancedResults);
});

//@description:     Get a single article
//@ route:          GET /krysto/api/v1/articles/:id
//@access:          Public
exports.getArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return next(
      new ErrorResponse(`Article not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: article });
});

//@description:     Create a article
//@ route:          POST /krysto/api/v1/articles
//@access:          Private
exports.createArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.create(req.body);
  res.status(201).json({
    success: true,
    data: article,
  });
});

//@description:     Update a article
//@ route:          PUT /krysto/api/v1/articles/:id
//@access:          Private
exports.updateArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!article) {
    return next(
      new ErrorResponse(`Article not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: article });
});

//@description:     Delete a article
//@ route:          DELETE /krysto/api/v1/articles/:id
//@access:          Private
exports.deleteArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) {
    return next(
      new ErrorResponse(`Article not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});



// @desc      Upload photo for article
// @route     PUT /api/v1/articles/:id/photo
// @access    Private
exports.articlePhotoUpload = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.id}`, 404)
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
  file.name = `article_photo_${article._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Article.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
