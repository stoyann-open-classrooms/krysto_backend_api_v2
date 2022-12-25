const mongoose = require("mongoose");
const slugify = require("slugify");

const RecyclableProductSchema = new mongoose.Schema(
  {
    refference: {
      type: String,
      required: [true, "Please add refference"],
      unique: true,
      trim: true,
      maxlength: [50, "Brand can not be more than 50 characters"],
    },

    barCode: {
      type: String,
      default: "no-photo.jpg",
    },

    brand: {
      type: String,
      required: [true, "Please add name"],
      unique: true,
      trim: true,
      maxlength: [50, "Brand can not be more than 50 characters"],
    },

    productName: {
      type: String,
      required: [true, "Please add name"],
      unique: true,
      trim: true,
      maxlength: [50, "Produucts can not be more than 50 characters"],
    },
    plastic_type: {
      type: mongoose.Schema.ObjectId,
      ref: "Plastic_type",
      required: true,
    },

    slug: String,
    description: {
      type: String,
      required: [true, "Please add description"],
      maxlength: [1000, "Name can not be more than 500 characters"],
    },
    recyclingNote: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create Partner slug from the name
RecyclableProductSchema.pre("save", function (next) {
  this.slug = slugify(this.brand, { lower: true });
  next();
});

module.exports = mongoose.model("RecyclableProduct", RecyclableProductSchema);
