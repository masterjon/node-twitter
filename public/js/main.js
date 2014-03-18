$(document).ready(function(){
	window.io = io.connect();

	io.on('connect', function(socket){
		console.log('hi');
		io.emit('hello?');
	});

	io.on('saludo', function(data){
		console.log(data);
	});

	io.on('log-in', function(data){
		$('#users').append('<li>'+data.username+'</li>');
	});

	io.on('log-out', function(data){
		$('#users li').each(function (i, item) {
			if(item.innerText === data.username){
				$(item).remove();
			}
		});
	});
	io.on('post',function(data){
		//debugger;
		var count=$("#data-count").data("item-count");
		if (!count){
			count=0;
		}
		count++;
		$("#data-count").data("item-count",count);
		$("title").html('('+count+') Feed');
		$("#posts").prepend('<li class="media list-group-item"><a href="https://twitter.com/'+data.user.username+'" class="pull-left thumbnail"><img class="media-object" src="'+data.user.twitter._json.profile_image_url+'" alt="Avatar"></a><div class="media-body"><h4 class="media-heading"><a target="_blank" href="https://twitter.com/'+data.user.username+'"><span class="glyphicon glyphicon-user"></span> @'+data.user.username+'</a></h4><p>'+data.content+'</p></div></li>');
	})



	$("textarea").keypress(function(event) {
	    if (event.which == 13) {
	        event.preventDefault();
	        $("form").submit();
	    }
	});
});