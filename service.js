"use strict";
var http = require('http');
var rw = require('./read-write');
var writer = new rw.Writer();
var reader = new rw.Reader();
var pathRegExp = /^(\d)*$/;
var fileRegExps = { 
	"text/javascript" : /(js)$/,
	"text/html" : /(html)$/,
	'text/plain' : /((vmd)|(spa)|(sph))$/,
	'image/bmp' : /(bmp)$/,
	'image/png' : /(png)$/
	 };

var server = http.createServer(function(req,res,err){
		var slashSplitedUrl = req.url.split('/');
		if(pathRegExp.exec(slashSplitedUrl[1])){
			console.log(slashSplitedUrl);
			writer.start();
			req.on('data',function(data){
				writer.add(data);
			}).on('end',function(){
				var filePath = slashSplitedUrl.join("/");
				writer.end(directoryname,filePath);
				res.end();
			});
		}else{
				var filetype = req.url.split('.');
				var filetypeLength = filetype.length;
				var body;
				var resData = {};
				for (var key in fileRegExps){
					if(fileRegExps[key].exec(filetype[filetypeLength-1])){
						resData['Content-Type'] = key
						break;
					}
				}
				try {
					body = reader.start(req.url);
					resData['Content-Langth'] = Buffer.byteLength(body);
					console.log(res + ":" + filetype[filetypeLength-1]);
					res.writeHead(200,resData);
				} catch (e){
					console.log(e);
					body = "Not Found";
					res.writeHead(404,{
							'Content-Length': Buffer.byteLength(body),
							'Content-Type': 'text/plain'
							});
				}		
			res.end(body);
		}
});

server.listen(3000);

console.log("!!!");
