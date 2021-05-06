const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;


const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [{
        path: 'String',
        filename: 'String'
    }],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        // ref calls the review model
        ref: 'Review'
    }]
});
// in doc are saved all the element deleted from CampgroundSchema so you can use Doc to access the reviews and delete them too.

// findOneAndDelete can only be used because we are using findByIdAndDelete on our app.js

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            // is asking to remove all the reviews with that ID inside the CampgroundSchema reviews.
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);