const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewRoute = require('./reviewRoute');

const route = express.Router();

// route.param('id', tourController.checkID);
route.use('/:tourId/reviews', reviewRoute);

route.route('/stats').get(tourController.getStats);
route
  .route('/year/:year')
  .get(
    authController.protected,
    authController.restrictedTo('admin', 'lead-guide', 'guide'),
    tourController.getYear
  );

route
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

route
  .route('/tour-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

route.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

route
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protected,
    authController.restrictedTo('admin', 'lead-guide'),
    tourController.addTours
  );
route
  .route('/:id')
  .get(tourController.getTours)
  .patch(
    authController.protected,
    authController.restrictedTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protected,
    authController.restrictedTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = route;
