const express = require("express");
// get controller function
const { getArticleCategories, createArticleCategory, getArticleCategory, updateArticleCategory, deleteArticleCategory, articleCategoryPhotoUpload } = require("../controllers/articleCategories");
const {protect, authorize} = require('../middlewares/auth')

// Include other resource routers


const router = express.Router();


const ArticleCategory = require('../models/ArticleCategory')
const advancedResults = require('../middlewares/advancedResults')



router.route("/").get(advancedResults(ArticleCategory, 'articles'), getArticleCategories).post(  createArticleCategory);
router.route("/:id").get(getArticleCategory).put(  updateArticleCategory).delete(  deleteArticleCategory);
router.route('/:id/photo').put(articleCategoryPhotoUpload)
module.exports = router;
