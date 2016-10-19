"use strict";
var http = require('http');
var rw = require('./read-write');
var writer = new rw.Writer();
var reader = new rw.Reader();
var pathRegExp = /^(\d)*$/;

var server = http.createServer(function(req,res,err){
		var slashSplitedUrl = req.url.split('/');
		if(pathRegExp.exec(slashSplitedUrl[1])){
			writer.start();
			req.on('data',function(data){
				writer.add(data);
			}).on('end',function(){
				writer.end(slashSplitedUrl[3]);
				res.end();
			});
		}else{
				var filetype = req.url.split('.');
				var body;
				try {
					body = reader.start(req.url);
					res.writeHead(200,{
							'Content-Length': Buffer.byteLength(body),
							'Content-Type': 'text/'+ filetype[filetype.length-1]
							});
				} catch (e){
					console.log(e);
					body = "Not Found";
					res.writeHead(404,{
							'Content-Length': Buffer.byteLength(body),
							'Content-Type': 'text/'+ filetype[filetype.length-1]
							});
				}		
			res.end(body);
		}
});

server.listen(3000);

console.log("!!!");
