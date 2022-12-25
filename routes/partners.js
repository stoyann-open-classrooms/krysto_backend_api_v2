const express = require("express");
// get controller function
const {
  getPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner,
  getPartnersInRadius,
  partnerPhotoUpload,
} = require("../controllers/partners");

const router = express.Router();
const {protect , authorize} = require("../middlewares/auth")

const Partner = require('../models/Partner')
const advancedResults = require('../middlewares/advancedResults')






router.route("/radius/:zipcode/:distance").get(getPartnersInRadius);
router.route("/").get(advancedResults(Partner), getPartners).post( protect ,  createPartner);
router.route("/:id").get(getPartner).put( updatePartner).delete(protect,   deletePartner);
router.route('/:id/photo').put(partnerPhotoUpload)

module.exports = router;
