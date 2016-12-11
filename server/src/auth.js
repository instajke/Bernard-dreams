// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '1375969802415495', // your App ID
        'clientSecret'    : '891eb8085a8a4ef2584cda54909eb803', // your App Secret
        'callbackURL'     : 'http://localhost:8888/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'ZV5UFiPZUS3iFO486r4rDxtRW',
        'consumerSecret'     : 'dlFGyXfqllOqSnQvNnK2z3jy8xSxdlNeWC5YvRX62Lqr3HslpO',
        'callbackURL'        : 'http://localhost:8888/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : 'your-secret-clientID-here',
        'clientSecret'     : 'your-client-secret-here',
        'callbackURL'      : 'http://localhost:8888/auth/google/callback'
    }

};
