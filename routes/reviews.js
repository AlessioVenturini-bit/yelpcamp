const express = require('express');
// mergeParams gives us access to the params defined on a route different from the one we are using
const router = express.Router({
    mergeParams: true
});
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')
const {
    isLoggedIn,
    validateReviews,
    isReviewAuthor
} = require('../middleware')
const reviews = require('../controllers/reviews');




// REVIEW route

router.post('/', isLoggedIn, validateReviews, catchAsync(reviews.createReview));



// DELETE route for Reviews

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;