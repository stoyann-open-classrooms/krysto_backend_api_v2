const express = require("express");
// get controller function
const { getCollects, createCollect, getCollect } = require("../controllers/collects");
const router = express.Router({mergeParams: true})
const {protect , authorize} = require("../middlewares/auth")
const Collect = require('../models/Collect')
const advancedResults = require('../middlewares/advancedResults')







router.route("/").get(advancedResults(Collect, {
    path: "collectPoint",
    select: "location.formattedAdress",
}), getCollects).post(createCollect)
router.route("/:id").get(getCollect)

module.exports = router;
