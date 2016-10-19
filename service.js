"use strict";
var http = require('http');
var fs = require('fs');
var cache = {};

var server = http.createServer(function(req,res,err){
		var body = "";
		var filetype = req.url.split(".");
		var slashSplitedUrl = req.url.split('/');
		if(slashSplitedUrl[1] === "0"){
			var reqBody = new Buffer('');
			req.on('data',function(data){
				reqBody = Buffer.concat([reqBody, data]);
				}).on('end',function(){
					//var reqbody = new Buffer(reqBody,'binary');
					fs.writeFileSync(__dirname + "/data/"+ slashSplitedUrl[3],reqBody,'binary');
					res.end();
					});
		}else{
			if(cache[req.url]){
				body = cache[req.url];
				res.writeHead(200,{
						'Content-Length': Buffer.byteLength(body),
						'Content-Type': 'text/'+ filetype[filetype.length-1]
						});
			}else{
				try {

					var text = fs.readFileSync(__dirname + req.url,'utf-8')
						body = text;
					cache[req.url] = text;
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
			}		
			res.end(body);
		}
});

server.listen(3000);

console.log("!!!");
