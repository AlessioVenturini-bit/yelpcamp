if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const Campground = require('../models/campground')
const {
    isLoggedIn,
    isAuthor,
    validateCampground
} = require('../middleware')
const campgrounds = require('../controllers/campgrounds');
// * no need to state index as express automatically looks forr index files
const {
    storage
} = require('../cloudinary');
const multer = require('multer')
const upload = multer({
    storage
})




router.route('/')
    // Index route
    .get(catchAsync(campgrounds.renderIndex))
    // the order matters. If this was placed after the ID route it wouldn't work as it would treat new as an ID
    //  Post route for the form in New route
    .post(isLoggedIn, upload.array('image.'), validateCampground, catchAsync(campgrounds.createCampground));

// New route
router.get('/new', isLoggedIn, campgrounds.renderNewForm);



router.route('/:id')
    // PUT route for Edit form

    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

    // Show route with ID
    .get(upload.array('image'), catchAsync(campgrounds.showCampground))

    // DELETE route
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// EDIT route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;