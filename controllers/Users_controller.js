// users_controller.js
var bcrypt = require('bcryptjs');
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var path = require('path');

//this is the users_controller.js file
router.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '..', 'index.html'));
});
router.get('/register', function(req,res) {
	res.render('users/register'); // *FRONT-END: Add directory "/users/...""
});

router.get('/sign-in', function(req,res) {
	res.render('users/sign_in');
});



// Register (New) User
// router.post('/create', function(req,res) {
// 	models.User.findAll({
//     where: {email: req.body.username}
//   }).then(function(users) {
//
// 		if (users.length > 0){
// 			console.log(users)
// 			res.send('An account already exists for this username')
// 		}else{
//
// 			// Solution:
// 			// =========
//
// 			// Using bcrypt, generate a 10-round salt,
// 			// then use that salt to hash the user's password.
// 			bcrypt.genSalt(10, function(err, salt) {
// 					bcrypt.hash(req.body.password, salt, function(err, hash) {
//
// 						// Using the User model, create a new user,
// 						// storing the email they sent and the hash you just made
// 						models.User.create({
// 							username: req.body.username,
// 							password_hash: hash
// 						})
// 						// In a .then promise connected to that create method,
// 						// save the user's information to req.session
// 						// as shown in these comments
// 						.then(function(user){
//
//
// 							// so what's happening here?
// 							// we enter the user's session by setting properties to req.
//
// 							// we save the logged in status to the session
// 		          req.session.logged_in = true;
// 		          // the username to the session
// 							req.session.username = user.username;
// 							// the user id to the session
// 		          req.session.user_id = user.id;
// 		          // and the user's email.
// 		          req.session.user_email = user.email;
//
// 		          // redirect to home on login
// 							res.redirect('/')
// 						});
// 					});
// 			});
//
// 		}
// 	});
// });
//
// // Sign-In (Existing) User
// router.post('/login', function(req, res) {
//   models.User.findOne({
//     where: {email: req.body.email}
//   }).then(function(user) {
//
// 		if (user == null){
// 			res.redirect('/')
// 		}
//
// 		// Solution:
// 		// =========
// 		// Use bcrypt to compare the user's password input
// 		// with the hash stored in the user's row.
// 		// If the result is true,
//     bcrypt.compare(req.body.password, user.password_hash, function(err, result) {
//         // if the result is true (and thus pass and hash match)
//         if (result == true){
//
//         	// save the user's information
// 					// to req.session, as the comments below show
//
// 					// so what's happening here?
// 					// we enter the user's session by setting properties to req.
//
// 					// we save the logged in status to the session
//           req.session.logged_in = true;
//           // the username to the session
// 					req.session.username = user.username;
// 					// the user id to the session
//           req.session.user_id = user.id;
//           // and the user's email.
//           req.session.user_email = user.email;
//
//           res.redirect('/welcome');
//         }
//         // if the result is anything but true (password invalid)
//         else{
//         	// redirect user to sign in
// 					res.redirect('/users/sign-in')
// 				}
//     });
//   })
// });

//passport implementation
passport.use(new LocalStrategy(
  function(username, password, done) {
    models.User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//authentication request for passport
router.post("/login",
  passport.authenticate('local', {failureRedirect: '/login'}),
  function(req, res){
    res.redirect('/');
  });


	router.post("/register", function(req, res){
	  models.User.create({
	      username: req.body.username,
	      password: req.body.password,
	      email: req.body.email
	    }).then(res.redirect('/home', function(error){
				console.log(error)
			}))
	});
// 	.then(function(user){
//
//
// 		// so what's happening here?
// 		// we enter the user's session by setting properties to req.
//
// 		// we save the logged in status to the session
// 		// req.session.logged_in = true;
// 		// // the username to the session
// 		// req.session.username = user.username;
// 		// // the user id to the session
// 		// req.session.user_id = user.id;
// 		// // and the user's email.
// 		// req.session.user_email = user.email;
//
// 		// redirect to home on login
// 		res.redirect('/')
// 	});
// });;
// .then(function(user){
//
// 	// so what's happening here?
// 	// we enter the user's session by setting properties to req.
//
// 	// we save the logged in status to the session
// 	req.session.logged_in = true;
// 	// the username to the session
// 	req.session.username = user.username;
// 	// the user id to the session
// 	req.session.user_id = user.id;
// 	// and the user's email.
// 	req.session.user_email = user.email;
//
// 	// redirect to home on login
// 	res.redirect('/')
// });
// });


module.exports = router;