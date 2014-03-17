var models=require('./models'),
	Schema = models.Schema;

var userSchema = Schema({
	username:'string',
	twitter:Schema.Types.Mixed   //dato tipo JSON(mongoose Mixed data type)
})

var User=models.model('user',userSchema);

module.exports = User