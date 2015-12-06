/*
 * GET home page.
 */

var config = require('../config/config-'+(process.env.ENV || 'dev')+'.js');


exports.index = function(req, res) {
	res.render('index', {
		title : 'CompLaIndia',
		GMapKey : config.GMap.key
	});
};

