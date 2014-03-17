 var passport=require('passport'),
 	 TwitterStrategy=require('passport-twitter').Strategy;
var User = require('../models/user');

var twitterConnection = function (server){
	console.log('Twitter coneccion ready');

	passport.use(new TwitterStrategy({
		consumerKey: '7BZPUzFYCUqty5VSxEKCg',
		consumerSecret: 'f1oFEls3hupAcyJ41KHL6vY70C2RJ47NOOFH7QlBp7E',
		callbackURL:'http://127.0.0.1:3000/auth/twitter/callback'
	},function (token,tokenSecret,profile,done){
		debugger;
		var user=new User({
			username:profile.username,
			twitter: profile
		})
		user.save(function(err){
			debugger;
			if (err){
				done(err,null)
				return;
			}
			done(null,profile);
		});
		
	}));

	server.get('/auth/twitter',passport.authenticate('twitter'));
	server.get('/auth/twitter/callback',passport.authenticate('twitter',{failureRedirect:'/?error=algo-fallo'}),
	function (req,res){
		res.redirect('/app');
	});

};
module.exports=twitterConnection;