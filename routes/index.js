var express = require('express');
var router = express.Router();

var Bird = require('../models/bird.js');

/* GET home page. */
router.get('/', function(req, res, next) {

  //Ask the schema to find all Bird documents.
  //Results provided via callback
  Bird.find(function(err, birdDocs){
    if (err) { return next(err); }
    return res.render('index', { birds: birdDocs });
});

router.post('/', function(req, res, next) {

  //Create new Bird object from req.body
  var newSightings = Bird(req.body);

  //And request that it is saved. Use callback to verify success
  //or report error.
  newSighting.save(function(err){
    if (err) { return next(err); }
    res.status(201); //created
    return res.redirect('/'); //get the home page
  });
});

module.exports = router;
