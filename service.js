"use strict";
var http = require('http');
var rwmanager = require("./rwManager");
var rwManager = new rwmanager.RWManager();
var pathRegExp = /^(\d)*$/;
var fileRegExps = { 
	"text/javascript" : /(js)$/,
	"text/html" : /(html)$/,
	'text/plain' : /((vmd)|(spa)|(sph))$/,
	'text/css' : /(css)$/,
	'image/bmp' : /(bmp)$/,
	'image/png' : /(png)$/,
	'application/force-download' : /(zip)$/
	 };

var server = http.createServer(function(req,res,err){
		var slashSplitedUrl = req.url.split('/');
		if(pathRegExp.exec(slashSplitedUrl[1])){
			var writeData = new Buffer('');
			req.on('data',function(data){
				writeData = Buffer.concat([writeData,data]);
			}).on('end',function(){
				rwManager.Write("/data" + req.url,writeData);
				res.end();
			});
		}else{ 
				var filetype = req.url.split('.');
				var filetypeLength = filetype.length;
				var body;
				var resData = {};
				for (var key in fileRegExps){
					if(fileRegExps[key].exec(filetype[filetypeLength-1])){
						resData['Content-Type'] = key;
						break;
					}
				}
				if(filetype[filetypeLength-1] === "zip"){
					resData['Content-disposition'] = "attachment; filename='download.zip'";
				}
				var body = rwManager.Read(req.url);
				if(body){
				console.log(Buffer.byteLength(body));
					resData['Content-Langth'] = Buffer.byteLength(body);
					res.writeHead(200,resData);
				res.end(body);
				}else{
					body = "Not Found";
					res.writeHead(404,{
							'Content-Length': Buffer.byteLength(body),
							'Content-Type': 'text/plain'
							});
				res.end(body);
				}
		}
});

server.listen(3000);

console.log("!!!");
