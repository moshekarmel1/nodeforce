var express = require('express');
var jsforce = require('jsforce');
var router = express.Router();

var port = process.env.PORT || 3001; // use heroku's dynamic port or 3001 if localhost
var cid = process.env.CLIENT_ID;
var csecr = process.env.CLIENT_SECRET;
var lserv = process.env.LOGIN_SERVER || "https://test.salesforce.com";
var redir = process.env.REDIRECT_URI || "http://localhost:" + port + "/oauth/callback";
// Salesforce OAuth2 client information
var oauth2 = new jsforce.OAuth2({
	loginUrl : 'https://test.salesforce.com',
    clientId: cid,
    clientSecret: csecr,
    redirectUri: redir
});
//validation function
function validate(obj){
    var opp = obj.Opportunity;
    obj.IQs.forEach(function(iq){
        obj.Tenors.forEach(function(tenor){
            obj.ErrorCriteria.forEach(function(errCriteria){
                if(eval(errCriteria.criteria)){
                    errCriteria.criteriaMet = true;
                }
            });
        });
    });
    return obj;
}
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
//logout
router.get('/logout', function(req, res){
    var conn = new jsforce.Connection({
        sessionId : req.session.accessToken,
        serverUrl : req.session.instanceUrl
    });
    conn.logout(function(err) {
      if (err) { return console.error(err); }
      // now the session has been expired.
      res.redirect('/');
    });
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

router.get('/accounts/:num', function(req, res) {
    // if auth has not been set, redirect to index
    if (!req.session.accessToken || !req.session.instanceUrl) { 
        res.redirect('/'); 
    }
    var num = req.params.num;
    // open connection with client's stored OAuth details
    var conn = new jsforce.Connection({
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });
    conn.sobject("Utility_Account__c")
    .select("Id, Name, Utility_Account_Number__c, Utility_Account_Outstanding_Balance__c")
    .where("Utility_Account_Number__c= '" + num + "'")
    .execute(function(err, records){
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        res.json(records);
    });
});

router.get('/validate/:id', function(req, res) {
    // if auth has not been set, redirect to index
    if (!req.session.accessToken || !req.session.instanceUrl) { 
        res.redirect('/'); 
    }
    var id = req.params.id;
    // open connection with client's stored OAuth details
    var conn = new jsforce.Connection({
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });
    var resObj = {};
    conn.sobject("Opportunity")
        .select("Id, Name, Record_Type_Name__c")
        .where("Id= '" + id + "'")
        .execute(function(err, records){
            if (err) {
                console.error(err);
                res.redirect('/');
            }
            resObj['Opportunity'] = records[0];
            conn.sobject("Intake_Queue__c")
                .select("*, LDC__r.Name, Commodity__r.Name, LDC__r.LDC_LDC__c")
                .where("Opportunity__c= '" + id + "'")
                .execute(function(err, records2){
                    if (err) {
                        console.error(err);
                        res.redirect('/');
                    }
                    resObj['IQs'] = records2;
                    conn.sobject("Tenor__c")
                        .select("*, Pricing_Product__r.Name")
                        .where("Opportunity__c= '" + id + "'")
                        .execute(function(err, records3){
                            if (err) {
                                console.error(err);
                                res.redirect('/');
                            }
                            resObj['Tenors'] = records3;
                            resObj['ErrorCriteria'] = [
                                {
                                    name: "PPL Rule", 
                                    criteria: "iq.LDC__r.Name == 'PPL' && iq.Utility_Account_Type__c == 'Residential' && tenor.Bill_Type__c == 'Single Bill'", 
                                    criteriaMet: false
                                },
                                {
                                    name: "EL Indexed Rule", 
                                    criteria: "iq.Commodity__r.Name == 'Electricity' && iq.LDC__r.LDC_LDC__c > 0 && tenor.Pricing_Product__r.Name == 'LBMP+' && tenor.Bill_Type__c == 'Single Bill'",
                                    criteriaMet: false
                                },
                                {
                                    name: "No Resi", 
                                    criteria: "iq.Utility_Account_Type__c == 'Residential'",
                                    criteriaMet: false
                                }
                            ];
                            var obj = validate(resObj);
                            res.json(obj);
                        });
                });
        });
});

module.exports = router;
