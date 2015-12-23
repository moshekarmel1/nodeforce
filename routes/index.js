var express = require('express');
var jsforce = require('jsforce');
var router = express.Router();

var port = process.env.PORT || 3001; // use heroku's dynamic port or 3001 if localhost
var cid = process.env.CLIENT_ID;
var csecr = process.env.CLIENT_SECRET;
var lserv = process.env.LOGIN_SERVER || "https://test.salesforce.com";
var redir = process.env.REDIRECT_URI || "http://localhost:" + port + "/token";
// Salesforce OAuth2 client information
var oauth2 = new jsforce.OAuth2({
	loginUrl : 'https://test.salesforce.com',
    clientId: cid,
    clientSecret: csecr,
    redirectUri: 'http://localhost:3000/oauth/callback'
});
/*
 * GET home page.
 */
router.get('/', function(req, res){
	if(!req.session || !req.session.accessToken){
		res.redirect('/oauth/auth');
	}else{
		res.render('index', { title: 'Salesforce.com Node.js REST Demo' })
	}
});

/* SF OAuth request, redirect to SF login */
router.get('/oauth/auth', function(req, res) {
    res.redirect(oauth2.getAuthorizationUrl({scope: 'api id web'}));
});

/* OAuth callback from SF, pass received auth code and get access token */
router.get('/oauth/callback', function(req, res) {
    var conn = new jsforce.Connection({oauth2: oauth2});
    var code = req.query.code;
    conn.authorize(code, function(err, userInfo) {
        if (err) {
        	return console.error(err);
        }

        req.session.userId = userInfo.id;
        req.session.accessToken = conn.accessToken;
        req.session.instanceUrl = conn.instanceUrl;
        res.redirect('/');
    });
});

router.get('/accounts', function(req, res) {
    // if auth has not been set, redirect to index
    if (!req.session.accessToken || !req.session.instanceUrl) { 
    	res.redirect('/'); 
    }
    var query = 'SELECT id, name FROM account LIMIT 10';
    // open connection with client's stored OAuth details
    var conn = new jsforce.Connection({
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });
    conn.query(query, function(err, result) {
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        res.json(result);
    });
});

module.exports = router;
