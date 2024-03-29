const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const AppError = require('./utilities/appError');
const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');
const viewRoute = require('./routes/viewRoute');
const reviewRoute = require('./routes/reviewRoute');
const bookingRoute = require('./routes/bookingRoute');
const errHandler = require('./controller/errorHandler');

//start express
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
app.use(helmet());
//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000, //1hr
  message: 'too many requests try again after an hour!',
});
app.use('/api', limiter);
//Body parser reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
//data sanitisation against noSQL query injections
app.use(mongoSanitize());
//data sanitisations against XSS
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'name',
      'maxGroupSize',
      'price',
      'difficulty',
    ],
  })
);

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//3) Routing
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'", 'https://*.cloudflare.com'],
      scriptSrcElem: ["'self'", 'https:', 'https://*.cloudflare.com'],
      styleSrc: ["'self'", 'https:', 'unsafe-inline'],
      connectSrc: ["'self'", 'data', 'https://*.cloudflare.com'],
    },
  })
);
app.use('/', viewRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRoute);

app.all('*', (req, res, next) => {
  // const err = new Error(`Cannot find the URL ${req.originalUrl}`);
  // err.statusCode = 404;
  // err.status = 'fail';
  next(new AppError(`Cannot find the URL ${req.originalUrl}`, 404));
});

app.use(errHandler);

module.exports = app;
