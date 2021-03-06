// users_controller.js
var bcrypt = require('bcryptjs');
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = models.User;
var Game = models.Game;
var enteredApplication;


//this is the users_controller.js file
router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});
// router.get('/register', function(req,res) {
//  res.render('layouts/main'); // *FRONT-END: Add directory "/users/...""
// });

// router.get('/sign-in', function(req,res) {
//  res.render('users/sign-in');
// });
// router.get("/register", function(req, res){
//   res.render("home")
// });

// router.get('/home', function (req, res){
//       if (req.user) {
//           Game.findAll({where: {UserId: req.user.id} }).then(function(success){
//             enteredApplication = success;
//           })
//           data = {
//             user: req.user,
//             enteredApp: enteredApplication
//           }
//           res.render('home', {data: data});
//           Game.findAll({where: {UserId: req.user.id} }).then(function(success){
//             enteredApplication = success;
//           })
//     } else {
//           res.render('home');
//     }
//   });



router.get('/home', function(req, res){
  res.render('home');
});

// router.get("/home/games", function(req, res){
//   models.Game.findAll({
//     include: [models.Game]
//   })
//   .then(function(games){
//     res.render("home")
//   })
// });

//passport implementation
  // passport.use(new LocalStrategy(
  //   function(username, password, done) {
  //     models.User.findOne({where: { username: username, password: password } }, function (err, user) {
  //       if (err) { return done(err); }
  //       if (!user) { return done(null, false); }
  //       if (!user.verifyPassword(password)) { return done(null, false); }
  //       return done(null, user);
  //     });
  //   }
  // ));

passport.use(new LocalStrategy(
 function(username, password, done) {
  //console.log(password);
  User.findOne(
    {
      where: 
        {
          username: username, 
          password: password 
        }
    }
  ).then(function (user) {
    //console.log(user);
     // if (err) { return done(err); }
    if (!user) {
      return done(null, false, console.log("Incorrect credentials"));
    }
      return done(null, user);
  }).catch(function(err) {
    throw err;
  })
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  // function (err, user) {
  //   done(err, user);
  // });

//authentication request for passport
router.post('/login',
  passport.authenticate('local'
    , {failureRedirect: '/'}
    ),
  function(req, res){
    console.log('Success');
    res.redirect('/home');
 });

// router.post('/login',
//   function(req, res){
//     models.User.findOne({where: {username: req.body.username, password: req.body.password}}).then(function(){
        
//     })
//     console.log('Success');
//     res.redirect('/home');
//  });

// was "/register"
router.post('/register', function(req, res){
  User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    }).then(function(users){res.redirect('/')   
  }, function(err){
    throw err
  });
});

router.get('/allgames', function(req, res) {

  // SOLUTION:
  // =========
  // use the Cat model to find all cats,
  // and use the include option to grab info from the User model.
  // This will let us show the cat and it's owner.
  Game.findAll({
    include: [ User ]
  })
  // connect the findAll to this .then
  .then(function(games) {
    // grab the user info from our req.
    // How is it in our req?
    // This info gets saved to req via the users_controller.js file.
    res.render('/home', {
      username: req.session.username,
      UserId: req.session.UserId,
      zipcode: req.body.zipcode,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      apt: req.body.apt,
      date: req.body.date,
      time: req.body.time
    });
  });
});

router.post('/newgame', function (req, res) {
  Game.create({
    // columnName: req.body.htmlFormName
    zipcode: req.body.zipcode,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    apt: req.body.apt,
    date: req.body.date,
    time: req.body.time
    // user_id: req.session.user_id (or find a way to access this if it is wrong. also sid's api needs this userid to put address into search)
  }).then(function(games) { // connect the .create to this .then
    res.redirect('/home');
  });
});

module.exports = router;
