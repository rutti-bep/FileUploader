"use strict";
var fs = require('fs');
var fsExtra = require('fs-extra');

class Reader {
	constructor(){
		this.systemFilePathIndex = JSON.parse(fs.readFileSync('systemFilePathIndex.json', 'utf8'));
		this.systemFilePathIndexLength = this.systemFilePathIndex.length;
	}

	Read(filePath){
		var state = this.PathIndexCheck(__dirname,filePath);
		if(state.state){
			var data;
			try {
				data = fs.readFileSync(__dirname + filePath);
			}
			catch (err) {
				data[err] = err;
			}
			return data;
		}
	}

	PathIndexCheck (directoryPath,filePath){
		console.log("r/w 26 : "+ directoryPath );
		console.log("r/w 27 : "+ filePath );
		var splitedFilePath = filePath.split("/");
		try {
			console.log("r/w 28 : " + directoryPath + splitedFilePath[0] + '/pathIndex.json');
			var filePathIndex = JSON.parse(fs.readFileSync(directoryPath + splitedFilePath[0] + '/pathIndex.json', 'utf8'));
		}
		catch(err){
			var filePathIndex = [];
			console.log( "r/w 33 : " + err);
		}
		var filePathIndexLength = filePathIndex.length;

		if(!splitedFilePath[1]){return {state:false,count:1};}

		for (var i = 0; i < filePathIndexLength ; i ++){
			if(filePathIndex[i] === splitedFilePath[1]){
				console.log("r/w 41 : " + splitedFilePath.length);
				if(splitedFilePath.length > 0){
					var reqDirectoryPath = directoryPath + splitedFilePath[0] + "/";
					splitedFilePath.shift();
					splitedFilePath = splitedFilePath.join("/");
					var returnData = this.PathIndexCheck(reqDirectoryPath,splitedFilePath);
					returnData.count++;
					return returnData
				}
			}
		}
		for (var i = 0; i < this.systemFilePathIndexLength; i++){
			if(this.systemFilePathIndex[i] === filePath) return {state:true,count:0};
		}
		return {state:false,count:1};
	}
}

class Writer extends Reader	{
	WriteSetUp(){
		this.data = new Buffer('');
	}

	WriteAdd(data){
		this.data = Buffer.concat([this.data,data]);
	}

	WriteEnd(filePath){
		var writeFilePath = "/data" + filePath;

		var splitedFilePath = writeFilePath.split("/");
		var splitedFilePathLength = splitedFilePath.length;
		var fileName = "/" + splitedFilePath[splitedFilePathLength-1];

		var directoryPath =  writeFilePath.split("/");
		directoryPath.pop();
		directoryPath.shift();
		//		directoryPath = directoryPath.join("/");

		var directoryPathString = directoryPath;
		directoryPathString = directoryPath.join("/");
		var state = this.PathIndexCheck(__dirname + "/",  "data"+filePath);
		console.log("r/w :86 : " + state.count);

		if(!state.state){
			fsExtra.mkdirsSync(__dirname + "/" + directoryPathString);
			console.log("r/w :88 : " + __dirname +"/"+ directoryPathString);

			for(var i = state.count+1; i < splitedFilePathLength-1; i++){
				var path = splitedFilePath;
				path = path.slice(0,i);
				path = path.join("/");
				console.log( "r/w :94 : " + __dirname+ path + '/pathIndex.json');
				try {
					var JsonData = JSON.parse(fs.readFileSync(__dirname+ path + '/pathIndex.json', 'utf8'));
				}
				catch(err){
					var JsonData = [];
					console.log( "read-write.js:96 : " + err);
				}
				JsonData.push(splitedFilePath[i]);
				fs.writeFileSync(__dirname + path + '/pathIndex.json', JSON.stringify(JsonData));
			}
		}
		fs.writeFileSync(__dirname +"/"+ directoryPathString + fileName	,this.data,'binary');
		try {
			var JsonData = JSON.parse(fs.readFileSync(__dirname +"/"+ directoryPathString + '/pathIndex.json', 'utf8'));
		}
		catch(err){
			var JsonData = [];
			console.log( "read-write.js:109 : " + err);
		}	
		JsonData.push( fileName );
		fs.writeFileSync(__dirname +"/" + directoryPathString  + '/pathIndex.json', JSON.stringify(JsonData));
	}
}


module.exports = { Writer : Writer , Reader : Reader};
