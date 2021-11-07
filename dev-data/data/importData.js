const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../model/tourModel');
const Review = require('../../model/reviewModel');
const User = require('../../model/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connected succcessfully!');
  });

//read data from db
const data = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const dataReview = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const dataUser = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);

//import to the model
const importData = async () => {
  try {
    await Tour.create(data);
    await User.create(dataUser, { validateBeforeSave: false });
    await Review.create(dataReview, { validateBeforeSave: false });
    console.log('Imported the data successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Deleted all the data successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
