var User = require('../models/user'),
	Post = require('../models/post'),
	_ = require('underscore');

var appController=function(server,users){
	console.log('Appcontoller cargado correctamente')

	var isntLoggedIn = function (req, res, next) {

	if(!req.session.passport.user){
		res.redirect('/');
		return;
	}
		next();
	};

	//middleware usado para hacer una query del usuario y guardarlo en el req
	var getUser = function (req,res,next){
		User.findOne({username:req.session.passport.user.username},function(err,user){
		
			req.user=user;
			next();
		});
	}
	server.get('/app', isntLoggedIn, function (req, res) {
		//hacemos una query de todos los posts para posteriormente pasarla al html
		//populate se puede omitir pero en este caso lo ocupamos para sacar los datos del usuario asociado al post y no solo el id
		Post.find({}).populate('user').exec(function(err,posts){
			debugger;
			//utilizamos underscore para mapear el resultado de la query a json
			var postsAsJson= _.map(posts,function(posts){
				return posts.toJSON();
			});
			debugger;
			//renderisamos la vista html de app y le pasamos como variables user y users
		    res.render('app', {
				user : req.session.passport.user, //en session.passport se guardan los datos del login 
				users : users,
				posts:posts
			});
		});

		
	});

	//en esta url se crean los nuevos posts (le pasamos el middleware getUser para obtener el usuario que asociaremos al post)
	server.post('/app/create-post',isntLoggedIn,getUser,function (req,res){
		//intancioamos nuestro modelo (tenemos un require arriba)
		var post= new Post({
			content:req.body.content, //guardamos el mensaje del posrt
			user:req.user  				//guardamos el usuario que realizo el post (Objeto de tipo usuario definido en models/User)
		})
		//guardamos en la BD
		post.save(function(err){

			if(err){
				res.send(500,err); //si hay error guardando  mandamos un eroor 500
			}
		
			//el server hace un broadcast a los clientes conectados para agregar el nuevod post en tiempo real
			server.io.broadcast('post',{ //construimos las variables a enviar esto lo recibe el cliente y se maneja en public/main.js
				content:post.content,
				user:req.user.toJSON()
			})

			res.redirect('/app'); //si no ,redireccionamos a app
		})
		
	})
}
module.exports=appController;