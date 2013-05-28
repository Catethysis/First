var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();

app.use(express.bodyParser());

app.get('/', function (req, res) {
	fs.open("data.txt", "r", 0664, function (err, file_handle) {
		fs.read(file_handle, 2000, null, "utf-8", function (err, data) {
			var page='<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>';
			page+='<link rel="stylesheet" href="style.css"/><style>.date{font-size:0.5em;} textarea{width:100%; resize:none;}</style></head><body><div class="wrap"><h1>Simple notepad</h1>';

			var spl=data.split('\r\n\a');
			for(var i=0;i<(spl.length+2)/4-1;i++)
				{
					//var text=spl[i*4+2].replace(new RegExp("\r\n",'g'),'<br>');
					var text=spl[i*4+2].split('\r\n').join('<br>');
					page+='<div class="record"><h2>'+spl[i*4]+'</h2>'/*'<span class="date">'+spl[i*4+1]+'</span><br>'*/+'<span class="text">'+text+'</span></div>';
				}
			page+='<br><div class="submit"><form method="post" action="/"><p><input type="text" name="topic" value="Topic"></input></p><p><textarea name="text" value=""></textarea></p><p>';
			page+='<input type="submit" value="Post"></p></form></div></div></body></html>';
			fs.close(file_handle);
		 	res.end(page);
		});
	});
});

app.get('/style.css', function (req, res) {
	fs.open("css/style.css", "r", 0664, function (err, file_handle) {
		if(!err){
			fs.read(file_handle, 10000, null, "utf-8", function (err, data) {
				console.log(req.params.file);
				res.end(data);
				fs.close(file_handle);
			});
		}
	});
});

app.post('/', function(req, res) {
	//console.log(req.body.text);
	fs.open("data.txt", "a", 0664, function (err, file_handle) {
		if(!err){
			fs.write(file_handle, req.body.topic+'\r\n\a'+(new Date).toString()+'\r\n\a'+req.body.text+'\r\n\a\r\n\a', null, "utf-8", function (err, written) {
				fs.close(file_handle);
			})
		}
	});
	res.redirect('back');
});

app.listen(80);