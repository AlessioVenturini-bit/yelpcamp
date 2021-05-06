const express = require('express');
const app = express();
const path = require('path')
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error :"));
db.once("open", () => {
    console.log("Database connected");
})

//  this is used to parse the req.body into an object
app.use(express.urlencoded({
    extended: true
}))






app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// __dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file.

//  An absolute path is defined as specifying the location of a file or directory from the root directory(/). In other words,we can say that an absolute path is a complete path from start of actual file system from / directory.
//  Relative path is defined as the path related to the present working directly(pwd). It starts at your current directory and never starts with a / .
//  express needs to serve views and or static files like CSS Javascript. If we don't serve our documents we won't have access to it
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // this sets the expire and max age to one week as Date.now returns todays date in milliseconds
        expires: Date.now() + 3600000 * 24 * 7,
        maxAge: 3600000 * 24 * 14
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// ! the authenticat method is added to User my passport-loca-mongoose. 
// * the below is saying to passport to use the local strategy that we have required on User once authenticated
passport.use(new LocalStrategy(User.authenticate()));
// ! the below are setting how to add and take out a user from a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// we are saving anything added to success through flash to locals.success ... this give access to success to all our templates
// no need to pass message : req.flash('success') to a template as it will be already available.
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})




//  we use restFul routes. See slide for guidance
app.get('/', (req, res) => {
    res.render('home')
});




app.use('/campgrounds', campgroundsRoutes);

app.use('/campgrounds/:id/reviews/', reviewsRoutes);

app.use('/', userRoutes);



app.listen(3000, () => {
    console.log("serving on port 3000")
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404));
})

app.use((err, req, res, next) => {
    const {
        statusCode = 500,
    } = err;
    // As Colt explained in the lecture, if you choose to use this approach, you won't have a default message when using destructuring. To avoid that, he used a condition to check if there's a message instead, so the approach above, with const {status=500,message="Something went wrong"}=err;, wouldn't display a default message. You would need to use this:
    if (!err.message) err.message = "oh No something went wrong"
    res.status(statusCode).render('./error', {
        err
    });
})