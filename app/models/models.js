var mongoose=require('mongoose');

// Heroku: Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/'+'backendPro';

mongoose.connect(uristring, function (err, res){
    if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
    
})

module.exports=mongoose