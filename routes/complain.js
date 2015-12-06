/*
 * GET complain API.
 */
var mongoose = require('mongoose');
var db = mongoose.createConnection((process.env.DB_URL || 'localhost'),
		(process.env.DB || 'complain'));
var ComplainSchema = require('../models/ObjectSchema.js').ComplainSchema;
var CommentSchema = require('../models/ObjectSchema.js').CommentSchema;
var Complain = db.model('complain', ComplainSchema);
var Comment = db.model('comment', CommentSchema);

exports.complain = function(req, res) {
	var indexStart = parseInt(req.query.index, 10);
	var limit = (parseInt(req.query.limit, 10) || 5);
	Complain.find({}).sort({
		date : -1
	}).limit(limit).skip((indexStart - 1) * 5).exec(function(e, complains) {
		res.setHeader('Content-Type', 'application/json');
		res.json(complains);
	});
};

exports.addComplain = function(req, res) {
//	console.log(req.body);
	var comp = req.body;
	comp.date = new Date();
	var complain = new Complain(comp);
	complain.save(function(e, docs) {
		if (e || !docs) {
			throw 'Error';
		} else {
			res.json(docs);
		}

	});
	res.json(true);
};

exports.complainCount = function(req, res) {
	Complain.count({}).exec(function(e, complains) {
		res.setHeader('Content-Type', 'application/json');
		res.json(complains);
	});
};

exports.comment = function(req, res) {
	var indexStart = parseInt(req.query.index, 10);
	var limit = (parseInt(req.query.limit, 10) || 5);
	var targets = (req.body || {});
	Comment.find(targets).sort({
		date : -1
	}).limit(limit).skip((indexStart - 1) * 5).exec(function(e, comments) {
		res.setHeader('Content-Type', 'application/json');
		res.json(comments);
	});
};

exports.addComment = function(req, res) {
//	console.log(req.body);
	var comm = req.body;
	comm.date = new Date();
	var comment = new Comment(comm);
	comment.save(function(e, docs) {
		if (e || !docs) {
			throw 'Error';
		} else {
			res.json(docs);
		}

	});
	res.json(true);
};

exports.commentCount = function(req, res) {
	var targets = (req.body || {});
	Comment.count(targets).exec(function(e, complains) {
		res.setHeader('Content-Type', 'application/json');
		res.json(complains);
	});
};

