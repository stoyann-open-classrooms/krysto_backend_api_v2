const mongoose = require("mongoose");
const slugify = require("slugify");

const ArticleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add description"],
      maxlength: [1000, "Name can not be more than 500 characters"],
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "ArticleCategory",
        
      },
    price: Number,
    weight_GR: Number,
    stock: Number,
    photo: {
      type: String,
      default: "no-photo.png",
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create Partner slug from the name
ArticleSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Article", ArticleSchema);
