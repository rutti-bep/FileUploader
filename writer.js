"use strict";
var fs = require('fs');
var fsExtra = require('fs-extra');

class Writer {
	Write(directoryPathArray,fileName,data){
		var filePath = __dirname + "/" + directoryPathArray.join("/") + "/" + fileName;
		var indexPath = __dirname + "/" + directoryPathArray.join("/") + "/pathIndex.json";
		var jsonData;

		fs.writeFileSync(filePath,data);
		try {
			jsonData = JSON.parse(fs.readFileSync(indexPath,"utf-8"));
		}catch(err){
			jsonData = [];
			console.log("writer.js:15 : " + err);
		}
		jsonData.push( fileName );
		fs.writeFileSync(indexPath,JSON.stringify(jsonData));
	}

	DirectoryDig(directoryPathArray,result){
		console.log("writer:23 :" + directoryPathArray);
		fsExtra.mkdirsSync(__dirname + "/"+ directoryPathArray.join("/"));
		var directoryPathArrayLength = directoryPathArray.length
		for (var i = result.count; i < directoryPathArrayLength; i ++){
			var path = directoryPathArray.concat();
			path = path.slice(0,i);
			path.push("pathIndex.json");
			path = __dirname + "/" + path.join("/");
			console.log("write:30 : " + path + " : " + directoryPathArray[i]);
			var jsonData;
			try {
				jsonData = JSON.parse(fs.readFileSync(path,"utf-8"));
			}catch(err){
				jsonData = [];
				console.log("writer.js:36 : " + err);
			}
			jsonData.push( directoryPathArray[i + 1]);
			fs.writeFileSync(path,JSON.stringify(jsonData));
		}
	}
}

module.exports = {Writer : Writer};
