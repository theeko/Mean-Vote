var mongoose = require("mongoose");

var PollSchema = new mongoose.Schema({
   question: String,
   choices: [{option: String, votes: {type: Number, default: 0}}],
   author : String
});

PollSchema.methods.upvote = function(index,cb){
   this.choices[index].votes += 1;
   this.save(cb);
};

mongoose.model("Poll", PollSchema);