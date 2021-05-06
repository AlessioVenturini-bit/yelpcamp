const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res) => {
    try {
        const {
            username,
            email,
            password

        } = req.body;
        const user = new User({
            username,
            email
        });
        const registeredUser = await User.register(user, password);
        // ! the below logs in the user once registered. without it the user would be created but they would need to log in after.req.login is from passport
        req.login(registeredUser, err => {
            if (err) return next(err);
        })
        req.flash('success', `User ${user.username} registered`)
        res.redirect('/campgrounds')
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');

};

module.exports.login = (req, res) => {
    const {
        username
    } = req.body
    req.flash('success', `Welcome Back ${username}`)
    // ! the below is to redirect the user to the page they were trying to access before logging in
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);


};

module.exports.logout = (req, res, ) => {
    req.logout();
    req.flash('success', 'Successfully logged out')
    res.redirect('/campgrounds')
}