const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name must be reqd'],
      unique: true,
      maxlength: [40, 'The max-length acceptable for a name is 40'],
      minlength: [7, 'The length of name must be greater than 10'],
    },
    slug: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A duration for tour must be reqd'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A group max must be provided'],
    },
    difficulty: {
      type: String,
      required: [true, 'The difficulty must be provided'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'The difficulty provided is not acceptable',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'The minimum rating is 1'],
      max: [5, 'The rating is out of 5 hence must be less than 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'The summary must be provided'],
    },
    price: {
      type: Number,
      required: [true, 'The price must be there'],
    },
    priceDiscount: {
      type: Number,
      //this won't work on update
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price {VALUE} should be less than actual price',
      },
    },
    description: {
      type: String,
      trim: true,
    },
    secretTour: Boolean,
    imageCover: {
      type: String,
      trim: true,
      required: [true, 'The image Cover must be there'],
    },
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

//virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Document Middleware run when we save() or when we create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });
// tourSchema.pre('save', function (next) {
//   console.log('Working on the doc...');
//   next();
// });
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

//Query Middleware
//use regEx to include all the find fn like findOne find findManyAndUpdate
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: '-__v' });
  next();
});

// tourSchema.post(/^find/, function (doc, next) {
//   console.log(
//     `The time taken by the query to complete is ${
//       Date.now() - this.start
//     } milliseconds`
//   );
//   next();
// });

//Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().push({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
