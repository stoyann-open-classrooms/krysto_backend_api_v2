const mongoose = require("mongoose");
const slugify = require("slugify");

const Plastic_typeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    identifier: Number,

    slug: String,
    description: {
      type: String,
      required: [true, "Please add description"],
      maxlength: [1000, "Name can not be more than 500 characters"],
    },

    scientific_name: {
      type: String,
      required: [true, "Please add scientific name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },

    photo: {
      type: String,
      default: "no-photo.jpg",
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create Plastic type slug from the name
Plastic_typeSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Plastic_type", Plastic_typeSchema);
