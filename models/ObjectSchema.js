var mongoose = require('mongoose');

exports.CommentSchema = new mongoose.Schema({
	targetId : String,
	comment : String,
	commentor : String,
	email : String,
	date : Date
});

var PlaceSchema = new mongoose.Schema({
	place : String,
	url : String,
	location : {G : Number, K : Number},
	place_id : String,
});

exports.ComplainSchema = new mongoose.Schema({
	text : String,
	complainant : String,
	email : String,
	location : String,
	date : Date,
	locationTags : Array,
    images : Array,
    placeInfo : {
    	place : String,
    	url : String,
    	location : {G : Number, K : Number},
    	placeId : String,
    }
});

exports.RequestSchema = new mongoose.Schema({
	title : String,
	text : String,
	requester : String,
	email : String,
	location : String,
	date : Date,
	locationTags : Array,
	contact : Number,
    images : Array,
    placeInfo : {
    	place : String,
    	url : String,
    	location : {G : Number, K : Number},
    	placeId : String,
    }
});

exports.AdvertSchema = new mongoose.Schema({
	title : String,
	text : String,
	requester : String,
	email : String,
	location : String,
	date : Date,
	locationTags : Array,
	contact : Number,
    images : Array,
    placeInfo : {
    	place : String,
    	url : String,
    	location : {G : Number, K : Number},
    	placeId : String,
    }
});