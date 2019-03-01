const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});
// serialze and deserialze are always used like this as a boiler plate
passport.deserializeUser(function(id, cb) {
    db.user.findById(id).then(function(user) {
        cb(null, user);
    }).catch(cb);
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, cb) {
    db.user.findOne({
        where: {email: email}  // find user by email
    }).then(function(user) {
        if (!user || !user.validPassword(password)) {  // if not user OR if not users pw, not valid
            cb(null, false);
        } else {
            cb(null, user);
        }
    }).catch(cb);
}));

module.exports = passport;