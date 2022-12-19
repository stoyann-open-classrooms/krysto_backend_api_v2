
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

const Collect = require("../models/Collect");
const CollectPoint = require("../models/CollectPoint");

//@description:     Get all collects
//@ route:          GET /krysto/api/v1/collects
//@access:          Public
exports.getCollects = asyncHandler(async (req, res, next) => {
 
  res
    .status(200)
    .json(res.advancedResults);
});

//@description:     Get a single collects
//@ route:          GET /krysto/api/v1/collects/:id
//@access:          Public
exports.getCollect = asyncHandler(async (req, res, next) => {
  const collect = await Collect.findById(req.params.id);
  if (!collect) {
    return next(
      new ErrorResponse(`Collect not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: collect });
});

//@description:     Create a collect
//@ route:          POST /krysto/api/v2/collectPoints/:collectPointId/collects
//@access:          Private
exports.createCollect = asyncHandler(async (req, res, next) => {
    req.body.collectPoint = req.params.collectPointId;

    const collectPoint = await CollectPoint.findById(req.params.collectPointId);
  
    if (!collectPoint) {
      return next(
        new ErrorResponse(`No collectPoint with the id of ${req.params.partnerId}`),
        404
      );
    }
  
    const collect = await Collect.create(req.body);
  
    res.status(200).json({
      success: true,
      data: collect,
    });
  });
  



