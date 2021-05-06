const Campground = require('../models/campground')


module.exports.renderIndex = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {
        campgrounds
    });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    // adding Flash
    req.flash('success', 'Successfuly created a new Campground')
    // redirects to the show page using the new camp id
    res.redirect(`/campgrounds/${campground._id}`)

}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {
        campground
    })
}

module.exports.updateCampground = async (req, res) => {
    const {
        id
    } = req.params;
    // we are finding and updating by ID. the second criteria is to say what do we want to update the element with
    // the spread operator is used to have access to campground object within the body object
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    req.flash('success', 'Successfuly edited Campground')
    res.redirect(`/campgrounds/${campground._id}`)

};

module.exports.showCampground = async (req, res) => {
    const campground = await (await Campground.findById(req.params.id)
        .populate({
            // *we are populating all the reviews
            path: 'reviews',
            // * we are populating the author of each review
            populate: {
                path: 'author'
            }
        })
        // *we are populating the author of the campground
        .populate('author'));
    if (!campground) {
        req.flash('error', 'Cannot find that Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {
        campground
    })
};

module.exports.deleteCampground = async (req, res) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findById(id)
    await Campground.findByIdAndDelete(id);
    req.flash('success', `${campground.title} was deleted`)
    res.redirect('/campgrounds')
};