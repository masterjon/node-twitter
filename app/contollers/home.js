var _ = require('underscore');
var homeController=function(server,users){
	console.log('Home controller cargado correctamente');
//middleware para login del usuario
	var inLoggedIn = function (req, res, next) {
	if(req.session.passport.user){
		res.redirect('/app');
		return;
	}

	next();
	};
	// cuando alguien entra a la raliz se ejecuta esta funcion, le pasamos el middleware inLoggedIn para saber si esta logueado o no
	server.get('/', inLoggedIn, function (req, res) {
		res.render('home');
	});

	server.post('/log-in', function (req, res) {
		users.push(req.body.username);

		req.session.user = req.body.username;
		server.io.broadcast('log-in', {username : req.session.user});

		res.redirect('/app');
	});
	server.get('/log-out', function (req, res) {
		users = _.without(users, req.session.user);

		server.io.broadcast('log-out', {username : req.session.user});

		req.session.destroy();
		res.redirect('/');
	});



}

module.exports=homeController;