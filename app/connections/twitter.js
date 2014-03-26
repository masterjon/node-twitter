 var passport=require('passport'),
 	 TwitterStrategy=require('passport-twitter').Strategy;
var User = require('../models/user');

var twitterConnection = function (server){
	console.log('Twitter coneccion ready');

	passport.use(new TwitterStrategy({
		consumerKey: 'your-consumer-key',
		consumerSecret: 'your-consumer-secret',
		callbackURL:'http://node-twitter.herokuapp.com/auth/twitter/callback'
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
