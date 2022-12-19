const mongoose = require("mongoose");
const slugify = require("slugify");

const ArticleCategorySchema = new mongoose.Schema(
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
    photo: {
      type: String,
      default: "no-photo.png",
    },
  },

  {
    timestamps: true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create Partner slug from the name
ArticleCategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// reverse populate with virtuals 

  ArticleCategorySchema.virtual('articles',  {
  ref:'Article',
  localField: '_id',
  foreignField: 'category',
  justOne: false
})

module.exports = mongoose.model("ArticleCategory", ArticleCategorySchema);
