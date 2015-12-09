var mongoose = require("mongoose");

var PollSchema = new mongoose.Schema({
   question: String,
   choices: String,
   author : String
});

// PollSchema.methods.upvote = function(){
//    this.choices[vote].votes += 1;
//    this.save(cb);
// };

mongoose.model("Poll", PollSchema);