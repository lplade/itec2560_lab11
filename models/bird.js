var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/* A bird-watch database.
Record types of birds, date spotted,
some other information.
*/

var birdSchema = new Schema({
  name : String,
  description : String,
  averageEggsLaid : Number, //Handles both integer and floats
  threatened : Boolean // Is bird vulnerable to extinction?
  dateSeen : Date // Date spotted in the wild
});

var Bird = mongoose.model('Bird', birdSchema);

module.exports = Bird;
