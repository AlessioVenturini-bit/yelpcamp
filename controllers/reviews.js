const Campground = require('../models/campground');
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review added successfully')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const {
        id,
        reviewId
    } = req.params;
    // the below expression is passing in an object called $pull that looks for the review in Campground and pulls the review with the review ID that we pass in
    await Campground.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Review Deleted')
    res.redirect(`/campgrounds/${id}`);
}