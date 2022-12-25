const express = require("express");
// get controller function
const { getRecyclableProsducts, getRecyclableProduct, updateRecyclableProduct, deleteRecyclableProducts, addRecyclableProducts, recyclableProductsPhotoUpload } = require("../controllers/recyclableProducts");
const router = express.Router({ mergeParams: true });
const Recyclable_product = require('../models/RecyclableProduct')
const { protect, authorize } = require("../middlewares/auth");

const Plastic_type= require("../models/Plastic_type");
const Partner = require("../models/Partner");
const advancedResults = require("../middlewares/advancedResults");

router
  .route("/")
  .get(
    advancedResults(Recyclable_product),
    getRecyclableProsducts
  )
  .post( addRecyclableProducts);
router
  .route("/:id")
  .get(getRecyclableProduct)
  .put(updateRecyclableProduct)
  .delete( deleteRecyclableProducts);
  router.route('/:id/photo').put(recyclableProductsPhotoUpload)

module.exports = router;
