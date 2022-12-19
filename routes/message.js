const express = require("express");
// get controller function
const { getMessage, createMessage, deleteMessage, getMessages } = require("../controllers/message");

const Message = require('../models/Message')
const advancedResults = require('../middlewares/advancedResults')


const router = express.Router({mergeParams: true});
const {protect, authorize} = require("../middlewares/auth")




router.route('/').get(advancedResults(Message), getMessages).post(createMessage)
router.route('/:id').get(getMessage).delete(  deleteMessage)


module.exports = router;
