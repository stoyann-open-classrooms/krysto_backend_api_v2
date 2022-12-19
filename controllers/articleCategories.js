const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

const ArticleCategory = require("../models/ArticleCategory");

//@description:     Get all articles
//@ route:          GET /krysto/api/v1/articleCategories
//@access:          Public
exports.getArticleCategories = asyncHandler(async (req, res, next) => {
 
  res
    .status(200)
    .json(res.advancedResults);
});

//@description:     Get a single articleCategory
//@ route:          GET /krysto/api/v1/articleCategories/:id
//@access:          Public
exports.getArticleCategory = asyncHandler(async (req, res, next) => {
  const articleCategory = await ArticleCategory.findById(req.params.id).populate('articles');
  if (!articleCategory) {
    return next(
      new ErrorResponse(`ArticleCategory not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: articleCategory });
});

//@description:     Create a articleCategory
//@ route:          POST /krysto/api/v1/articles
//@access:          Private
exports.createArticleCategory = asyncHandler(async (req, res, next) => {
  const articleCategory = await ArticleCategory.create(req.body);
  res.status(201).json({
    success: true,
    data: articleCategory,
  });
});

//@description:     Update a article
//@ route:          PUT /krysto/api/v1/articles/:id
//@access:          Private
exports.updateArticleCategory = asyncHandler(async (req, res, next) => {
  const articleCategory = await ArticleCategory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!articleCategory) {
    return next(
      new ErrorResponse(`Article category not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: articleCategory });
});

//@description:     Delete a article
//@ route:          DELETE /krysto/api/v1/articles/:id
//@access:          Private
exports.deleteArticleCategory = asyncHandler(async (req, res, next) => {
  const articleCategory = await ArticleCategory.findByIdAndDelete(req.params.id);
  if (!articleCategory) {
    return next(
      new ErrorResponse(`Article category not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});



// @desc      Upload photo for article category
// @route     PUT /api/v1/articles/:id/photo
// @access    Private
exports.articleCategoryPhotoUpload = asyncHandler(async (req, res, next) => {
  const articleCategory = await ArticleCategory.findById(req.params.id);

  if (!articleCategory) {
    return next(
      new ErrorResponse(`Article category not found with id of ${req.params.id}`, 404)
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
  file.name = `article_category_photo_${articleCategory._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await ArticleCategory.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
