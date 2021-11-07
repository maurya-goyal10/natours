const Review = require('../model/reviewModel');
const catchAsync = require('../utilities/catchAsync');
// const AppError = require('../utilities/appError');
const factory = require('./handlerFactory');

exports.fetchTourId = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.createReview = factory.createOne(Review);
