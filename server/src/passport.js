var localStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('./user/user.model.js');

var configAuth = require('./auth');

module.exports = function(passport) {
    passport.use(new localStrategy(User.authenticate()));
    //passport.serializeUser(User.serializeUser());
    //passport.deserializeUser(User.deserializeUser());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // Facebook strategy
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL

        },

// facebook will send back the token and profile
        function(token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function() {

                // find the user in the database based on their facebook id
                User.findOne({ 'username' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.username    = profile.id; // set the users facebook id
                        newUser.facebookToken = token; // we will save the token that facebook provides to the user
                        newUser.name  = profile.name.givenName; // look at the passport user profile to see how names are returned
                        newUser.password = "somepassword";
                        //newUser.surname = profile.name.familyName;
                        //newUser.email = (profile.emails[0].value || '').toLowerCase();

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

};