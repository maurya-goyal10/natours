const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');

const route = express.Router();

// route.use();

route.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
route.get('/tour/:tourSlug', authController.isLoggedIn, viewController.getTour);
route.get('/login', authController.isLoggedIn, viewController.getLoginForm);
route.get('/me', authController.protected, viewController.getMe);
route.get('/my-tours', authController.protected, viewController.getMyTours);

// route.post(
//   '/submit-user-data',
//   authController.protected,
//   viewController.update
// );

module.exports = route;
