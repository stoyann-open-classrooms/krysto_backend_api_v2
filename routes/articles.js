const express = require("express");
// get controller function
const { getArticle, createArticle, getArticles, deleteArticle, updateArticle, articlePhotoUpload } = require("../controllers/articles");
const {protect, authorize} = require('../middlewares/auth')

// Include other resource routers


const router = express.Router();


const Article = require('../models/Article')
const advancedResults = require('../middlewares/advancedResults')



router.route("/").get(advancedResults(Article , {
    path: "category",
    select: "name",
}), getArticles).post(  createArticle);
router.route("/:id").get(getArticle).put(  updateArticle).delete(  deleteArticle);
router.route('/:id/photo').put(  articlePhotoUpload)
module.exports = router;
