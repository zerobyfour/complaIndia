/*
 * GET Request and ad.
 */
var mongoose = require('mongoose');
var db = mongoose.createConnection((process.env.DB_URL || 'localhost'),
		(process.env.DB || 'complain'));
var RequestSchema = require('../models/ObjectSchema.js').RequestSchema;
var AdvertSchema = require('../models/ObjectSchema.js').AdvertSchema;
//console.log(ComplainSchema);
var Request = db.model('request', RequestSchema);
var Advert = db.model('advert', AdvertSchema);
exports.index = function(req, res) {
	res.render('index', {
		title : 'CompLaIn'
	});
};

exports.request = function(req, res) {
	var indexStart = parseInt(req.query.index, 10);
	var limit = (parseInt(req.query.limit, 10) || 5);
	Request.find({}).sort({
		date : -1
	}).limit(limit).skip((indexStart - 1) * 5).exec(function(e, requests) {
		res.setHeader('Content-Type', 'application/json');
		res.json(requests);
	});
};

exports.addRequest = function(req, res) {
//	console.log(req.body);
	var comp = req.body;
	comp.date = new Date();
	var request = new Request(comp);
	request.save(function(e, docs) {
		if (e || !docs) {
			throw 'Error';
		} else {
			res.json(docs);
		}

	});
	res.json(true);
};

exports.requestCount = function(req, res) {
	Request.count({}).exec(function(e, requests) {
		res.setHeader('Content-Type', 'application/json');
		res.json(requests);
	});
};


exports.advert = function(req, res) {
	var indexStart = parseInt(req.query.index, 10);
	var limit = (parseInt(req.query.limit, 10) || 5);
	Advert.find({}).sort({
		date : -1
	}).limit(limit).skip((indexStart - 1) * 5).exec(function(e, adverts) {
		res.setHeader('Content-Type', 'application/json');
		res.json(adverts);
	});
};

exports.addAdvert = function(req, res) {
//	console.log(req.body);
	var comp = req.body;
	comp.date = new Date();
	var advert = new Advert(comp);
	advert.save(function(e, docs) {
		if (e || !docs) {
			throw 'Error';
		} else {
			res.json(docs);
		}

	});
	res.json(true);
};

exports.advertCount = function(req, res) {
	Advert.count({}).exec(function(e, adverts) {
		res.setHeader('Content-Type', 'application/json');
		res.json(adverts);
	});
};
