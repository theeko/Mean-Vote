var mongoose = require('mongoose');
var Poll = mongoose.model('Poll');
var User = mongoose.model('User');
var express = require('express');
var jwt = require('express-jwt');
var passport = require('passport');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password);

    user.save(function (err){
        if(err){ return next(err); }

        return res.json({token: user.generateJWT()});
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
      return res.status(400).json({message: 'Please fill out all fields'});
    }
    
    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }
    
        if(user){
          return res.json({token: user.generateJWT()});
        } else {
          return res.status(401).json(info);
        }
    })(req, res, next);
});

router.param('poll', function(req, res, next, id) {
  var query = Poll.findById(id);

  query.exec(function (err, poll){
    if (err) { return next(err); }
    if (!poll) { return next(new Error('can\'t find poll')); }

    req.poll = poll;
    return next();
  });
});

router.get('/polls/:poll', function(req, res) {
    res.json(req.poll);
});

// router.get("/profile", function(req, res, next) {
//   Poll.find({author: req.payload.username},function(err, polls){
//       if(err) { return next(err); }
//       res.json(polls);
//     });
// });

router.get('/polls/author/:username', function (req, res, next) {
    var username = req.params.username;
    Poll.find({author: username}, function (err, polls) {
        if (err) { next(err) }
        
        res.json(polls);
    });
});

router.delete('/polls/:poll', function(req, res, next) {
    req.poll.remove(function(err, poll){
        if (err) { return next(err); }

        res.json(poll);
    });
});

router.get("/polls",  function(req, res, next) {
    Poll.find(function(err, polls){
      if(err) { return next(err); }
      res.json(polls);
    });
});

router.post("/polls", auth, function(req, res, next) {
  var poll = new Poll(req.body);
  poll.author = req.payload.username;
  
  poll.save(function(err, poll){
    if (err) { return next(err); }
    res.json(poll);
  });
});


module.exports = router;