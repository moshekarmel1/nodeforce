/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Salesforce.com Node.js REST Demo' })
};
