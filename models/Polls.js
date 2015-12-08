var mongoose = require("mongoose");

var PollSchema = new mongoose.Schema({
   question: String,
   author: String,
   choices: [{option: String, votes: {type: Number, default: 0}}]
});

PollSchema.methods.upvote = function(){
   this.choices[vote].votes += 1;
   this.save(cb);
};

mongoose.model("Poll", PollSchema);