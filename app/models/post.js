var models=require('./models'),
	Schema = models.Schema;
//declaramos el modelo de los post
var PostSchema=Schema({
	content:'string',
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	}
});
var Post=models.model('post',PostSchema);

module.exports=Post;