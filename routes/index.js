var express = require('express');
var router = express.Router();

var Bird = require('../models/bird.js');

/* GET home page. */
router.get('/', function (req, res, next) {
	//Ask the schema to find all Bird documents.
	//Results provided via callback
	Bird.find(function (err, birdDocs) {
		if (err) {
			return next(err);
		}
		return res.render('index', {
			birds: birdDocs,
			error: req.flash('error')
		});
	});
});

router.post('/', function (req, res, next) {

	//Since we are not requiring every field, let's
	//something something req.body

	for (var att in req.body) {
		if (req.body[att] === '') {
			delete(req.body[att]);
		}
	}
	console.log(req.body.datesSeen);
	var date = req.body.datesSeen || Date.now(); //s

	req.body.datesSeen = [];
	req.body.datesSeen.push(date);

	//Build nested nestData
	req.body.nestData = {
		'location' : req.body.location,
		'materials' : req.body.materials
	};

	//Create new Bird object from req.body
	var newSighting = Bird(req.body);
	//And request that it is saved. Use callback to verify success
	//or report error.
	newSighting.save(function (err) {
		//Handle validation errors
		if (err) {
			if (err.name = "ValidationError") {
				req.flash('error', 'Invalid data'); // TODO more helpful error messages
				return res.redirect('/');
			}
			//Handle duplication errors. For our schema, we can't have two birds with
			if (err.code == 11000) { //MongoDB duplicate key error
				req.flash('error', 'A bird with that name already exists');
				return res.redirect('/');
			}
			//Some other error - pass to app err
			return next(err);
		}
		//If no error, bird created. Redirect
		res.status(201); //created
		return res.redirect('/'); //get the home page
	});
});

router.post('/addDate', function (req, res, next) {

	//Check if user provided a date
	var newSighting = req.body.dateSeen;
	if (!newSighting || newSighting == '') {
		//TODO error message for user, ask them to enter date
		return res.redirect('/');
	}

	//Need to find the bird with this name,
	//add the new date to datesSeen, and save it
	Bird.findOne({name: req.body.name}, function (err, bird) {
		if (err) {
			return next(err)
		}
		//If no bird found, then send message to app error handler
		if (!bird) {
			return next(new Error('No bird found with name ' + req.body.name))
		}

		bird.datesSeen.push(newSighting); //Add this date to datesSeen array

		bird.save(function (err) { //And save
			if (err) {
				return next(err);
			} //Checkfor errors
			res.redirect('/'); //Redirect to home page
		});
	});
});

router.post('/deleteBird', function (req, res, next){ // This SEEMS to be working
	Bird.findOne({name: req.body.name}, function(err, bird){
		if (err){
			return next(err);
		}
		//If no bird found, then send message to app error handler
		if (!bird) {
			return next(new Error('No bird found with name ' + req.body.name))
		}
		Bird.remove( { name : req.body.name }, function(err){
			if (err){
				return next(err);
			}
		});
		//If no error, bird created. Redirect
		res.status(201); //created
		return res.redirect('/'); //get the home page
	})
});

router.post('/editBird', function(req, res, next){
	Bird.findOne({name: req.body.name}, function(err, birdDoc){
		if (err){
			return next(err);
		}
		if (!birdDoc) {
			return next(new Error('No bird found with name ' + req.body.name))
		}
		return res.render('edit', {
			bird: birdDoc,
			error: req.flash('error')
		});
	})
});


module.exports = router;
