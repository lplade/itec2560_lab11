var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/* A bird-watch database.
Record types of birds, date spotted,
some other information.
*/

var birdSchema = new Schema({
  name : {
	  type: String,
	  required: true,
	  unique: true,
	  lowercase: true //convert to lowercase - helpfu
  },
  description : String,
  averageEggsLaid : {
	  type: Number,
	  min: 1,
	  max: 50
  }, //Handles both integer and floats
  threatened : {
	  type: Boolean,
	  default: false
  }, // Is bird vulnerable to extinction?
  datesSeen : [{
	  type: Date,
	  default: Date.now
  }] // Date spotted in the wild
});

var Bird = mongoose.model('Bird', birdSchema);

module.exports = Bird;
