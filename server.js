var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
console.log('Served')
server.listen(80);

var d = {
	none: function(e){
		e.end('No data to display =(')
	}
}
var data = {}
app.get('/', function(req, res) {
    res.send('Для тоо чтобы перейти на нужный канал напиши в адресной строке название канала после названия сайта. Пример: http://18.221.71.184/big_ass')
});
app.get('/:id', function(req, res) {
    res.end(`
  	<!DOCTYPE html>
	<html>
	<head>
	    <title>${req.params.id}</title>
	    <script src="https://cdnjs.cloudflare.com/ajax/libs/zepto/1.2.0/zepto.min.js" type="text/javascript"></script>
	    <script src="http://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
	    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.2.0/css/iziToast.min.css">
	    <script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.2.0/js/iziToast.min.js" type="text/javascript"></script>
	    <script type="text/javascript">
	    function ohSnap(n,t){var o={color:null,icon:null,duration:"5000","container-id":"ohsnap","fade-duration":"fast"};t="object"==typeof t?$.extend(o,t):o;var a=$("#"+t["container-id"]),e="",i="",h="";t.icon&&(e="<span class='"+t.icon+"'></span> "),t.color&&(i="alert-"+t.color),h=$('<div class="alert '+i+'">'+e+n+"</div>").fadeIn(t["fade-duration"]),a.append(h),h.on("click",function(){ohSnapX($(this))}),setTimeout(function(){ohSnapX(h)},t.duration)}function ohSnapX(n,t){defaultOptions={duration:"fast"},t="object"==typeof t?$.extend(defaultOptions,t):defaultOptions,"undefined"!=typeof n?n.fadeOut(t.duration,function(){$(this).remove()}):$(".alert").fadeOut(t.duration,function(){$(this).remove()})}
	    </script>
	    <style>
	    /* ALERTS */
	    #ohsnap{
	    	position: absolute;
		    right: 0;
		    bottom: 0;
	    }
	    .alert {
		  padding: 15px;
		  margin-bottom: 20px;
		  border: 1px solid #eed3d7;
		  border-radius: 4px;
		  position: relative;
		  bottom: 0px;
		  right: 21px;
		  /* Each alert has its own width */
		  float: right;
		  clear: right;
		  background-color: white;
		}

		.alert-red {
		  color: white;
		  background-color: #DA4453;
		}
		.alert-green {
		  color: white;
		  background-color: #37BC9B;
		}
		.alert-blue {
		  color: white;
		  background-color: #4A89DC;
		}
		.alert-yellow {
		  color: white;
		  background-color: #F6BB42;
		}
		.alert-orange {
		  color:white;
		  background-color: #E9573F;
		}
	    </style>
    </head>
	    <body>
	    	<p>You are on a '${req.params.id}' channel!</p>
	    	<p>Waiting on messages...</p>

	    	<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js"></script>
			<script>
			  var socket = io.connect('http://18.221.71.184');
			  socket.on('${req.params.id}', function (data) {
			  	console.log(data.text)
			    if(data.channel==window.location.pathname.split('/')[1]){
			    	if(data.text.indexOf('joined') != -1)
				    	iziToast.warning({
						    title: 'Welcome!',
						    message: data.text+' Welcome!',
						    position: 'topLeft'
						});
					if(data.text.indexOf('tipped') != -1)
						ohSnap(data.text+' <b>Thanks!</b>', {'duration':'2000'});
			    }
			  });
			  setTimeout(function() {$('p').remove()}, 5000);
			  socket.on('exxx', function (data) {
			  	console.log(data)
			  });
			</script>
			<div id="ohsnap"></div>
	    </body>
	
	</html>`);
});
app.get('/:id/stat', function(req, res) {
	!data.hasOwnProperty(req.params.id)?d.none(res):res.end(data[req.params.id].status)
});
app.get('/:id/coun', function(req, res) {
	!data.hasOwnProperty(req.params.id)?d.none(res):res.end(data[req.params.id].users)
});
app.get('/:id/goal', function(req, res) {
	!data.hasOwnProperty(req.params.id)?d.none(res):res.end(data[req.params.id].goal)
});
app.get('/:id/gbar', function(req, res) {
	!data.hasOwnProperty(req.params.id)?d.none(res):res.end(data[req.params.id].progress+'%')
});
app.get('/:id/chat', function(req, res) {
	!data.hasOwnProperty(req.params.id)?d.none(res):res.end(JSON.stringify(data[req.params.id].chat))
});
app.get('/:id/tipa', function(req, res) {
	d.none(res)
});
app.get('/:id/data', function(req, res) {
	res.end(JSON.stringify(data))
});

io.on('connection', function(socket) {

    socket.on('ext', function(msg) {
        if (msg.text){
        	data[msg.channel].chat.push(msg.text)
            if (msg.text.indexOf('tipped') != -1 || msg.text.indexOf('joined') != -1)
                io.emit(msg.channel, msg);
        }
        if(msg.data)
        	data[msg.channel] = msg.data

        io.emit('exxx', msg)
    });
});