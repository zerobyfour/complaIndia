// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var fs = require('fs');
var logger = require('../winston/log.js');
var config = require('../config/config-'+(process.env.ENV || 'dev')+'.js');
//logger.info('started');
/**
 * Don't hard-code your credentials!
 * Export the following environment variables instead:
 *
 * export AWS_ACCESS_KEY_ID='AKID'
 * export AWS_SECRET_ACCESS_KEY='SECRET'
 */	
// Set your region for future requests.
AWS.config.region = config.AWS.region;
AWS.config.accessKeyId = config.AWS.accessKeyId;
AWS.config.secretAccessKey = config.AWS.secretAccessKey;
var bucket =config.AWS.bucket;

var s3 = new AWS.S3({
	accessKeyId : config.AWS.accessKeyId,
	secretAccessKey : config.AWS.secretAccessKey
});

exports.putObject = function(req, res){
	var file = req.files.file;
	var key = new Date().getTime()+"/"+file.name;
	fs.readFile(file.path, function (err, data) {
		var params = {Bucket : bucket, Key : key, Body : data};
		s3.upload(params,function(err,data){
			var getParams = {Bucket : bucket, Key : key};
			var url = s3.getSignedUrl('getObject',getParams);
//			console.log(data);
			fs.unlink(file.path, function (err) {
                if (err) {
//                    console.error(err);
                    logger.error(err);
                }
//                console.log('Temp File Delete');
            });
			var result = {id : key, url : url};
			logger.info(result);
			res.json(result);
			});			
		});
}; 

exports.getSignedUrl = function(req, res){
	var body = req.body;
	var key = req.query.key;
	var params = {Bucket : bucket, Key : key};
	var url = s3.getSignedUrl('getObject', params);
	var result = {id : key, url : url};
	res.json(result);
};