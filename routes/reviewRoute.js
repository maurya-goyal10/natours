const express = require('express');
const reviewController = require('../controller/reviewController');
const authController = require('../controller/authController');

// POST /tours/2345678/review === POST /
// GET /tours/23434/review === GET /
const route = express.Router({ mergeParams: true });
//all routes after these can only be accessed if logged in
route.use(authController.protected);

route
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictedTo('user'),
    reviewController.fetchTourId,
    reviewController.createReview
  );
route
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictedTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictedTo('user', 'admin'),
    reviewController.deleteReview
  );
module.exports = route;
