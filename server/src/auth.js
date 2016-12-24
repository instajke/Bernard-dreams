// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '1375969802415495', // your App ID
        'clientSecret'    : '891eb8085a8a4ef2584cda54909eb803', // your App Secret
        'callbackURL'     : 'http://kmpm.eu-gb.mybluemix.net/api/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'iELCH5VFlzUNW7pY2RGQBBrdS',
        'consumerSecret'     : 'wPhzbAiYRKjfAq2WoGrDEKTvv29lonEEMB6mMY7HZIS7UvWSZV',
        'callbackURL'        : 'http://kmpm.eu-gb.mybluemix.net/api/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '79570659241-ib42t4geja7cp1vsi5pigjo1934usnsh.apps.googleusercontent.com',
        'clientSecret'     : 'KNFNsi2OmWsnVYXE76RwQ83K',
        'callbackURL'      : 'http://kmpm.eu-gb.mybluemix.net/api/google/callback'
    }

};
