const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require('../utils/geocoder')


const CollectPointSchema = new mongoose.Schema(
  {
    remarque: {
      type: String,
      required: [true, "Please add description"],
      maxlength: [500, "Name can not be more than 500 characters"],
    },
    public: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    qrCode: {
      type: String,
      default: "no-photo.png",
    },
    daysBetweenCollect: {
      type: Number,
      default: 7,
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      zipcode: String,
      country: String,
    },
  
    photo: {
      type: String,
      default: "no-photo.png",
    },
    recycled: Number,
   

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
 
  },

  {
    timestamps: true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// Geocode & create location field
CollectPointSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      street: loc[0].streetName,
      city: loc[0].city,
      zipcode: loc[0].zipcode,
      country: loc[0].countryCode
    };
      
  // Do not save address in DB
  this.address = undefined;
  next();
});

// reverse populate with virtuals 

CollectPointSchema.virtual('collects',  {
  ref:'Collect',
  localField: '_id',
  foreignField: 'collectPoint',
  justOne: false
})


module.exports = mongoose.model("CollectPoint", CollectPointSchema);
