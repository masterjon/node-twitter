var express = require('express.io'),
	logfmt = require("logfmt"),
	swig = require('swig'),
	 _ = require('underscore'),
	 passport=require('passport');

var url = require('url');

var RedisStore = require('connect-redis')(express);
//Heroku Redis 2 go support
//var RedisStore = require('redis-url').connect(process.env.REDISTOGO_URL);



var server = express();
//for heroku deployment
server.use(logfmt.requestLogger());
server.http().io();

var users = [];

// Configuracion para renderear vistas
server.engine('html', swig.renderFile);
server.set('view engine', 'html');
server.set('views', './app/views');

// Agregamos post, cookie y sessiones
server.configure(function() {
	var redisUrl = url.parse(process.env.REDISTOGO_URL);
 	var redisAuth = redisUrl.auth.split(‘:’);
	// Carga archivos estaticos
	server.use(express.static('./public'));

	server.use(express.logger());
	server.use(express.cookieParser());
	server.use(express.bodyParser());

	server.use(express.session({
		secret : "lolcatz",
		store  : new RedisStore({
			host: redisUrl.hostname,
            port: redisUrl.port,
            db: redisAuth[0],
            pass: redisAuth[1]
		})
		// store  : new RedisStore({
		//	host : conf.redis.host,
		//	port : conf.redis.port,
		//	user : conf.redis.user,
		//	pass : conf.redis.pass
		// });	
	}));
	server.use(passport.initialize());
	server.use(passport.session())
});

passport.serializeUser(function(user,done){
	done(null,user);
})
passport.deserializeUser(function(obj,done){
	done(null,obj);
})

//contollers
var homeContoller=require('./app/contollers/home');
var appContoller=require('./app/contollers/app');


homeContoller(server,users);
appContoller(server,users);

//conections
var twitterConnection=require('./app/connections/twitter');
twitterConnection(server,users);



server.io.route('hello?', function(req){
	
	req.io.emit('saludo', {
		message: 'serverReady'
	});
});

//let heroku choose port for deploy 
 var port = Number(process.env.PORT || 5000);
server.listen(port, function() {
     console.log("Listening on " + port);
    });
