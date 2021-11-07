const express = require('express');
const bookingController = require('../controller/bookingController');
const authController = require('../controller/authController');

const route = express.Router();
route.use(authController.protected);
route.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

route.use(authController.restrictedTo('admin', 'lead-guide'));
route
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);
route
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = route;
