export default {

    oidc: {
        clientId: 'oktaclientID', //public identifier of app
        issuer: 'https://youroktadomain/oauth2/default', //issuer of tokens + url when authorizing with okta authorization server
        redirectUri: 'https://apiurl/login/callback',
        scopes: ['openid', 'profile', 'email'] // provide access to information about user
    }

}
