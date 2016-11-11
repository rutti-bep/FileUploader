"use strict";
var fs = require('fs');
var fsExtra = require('fs-extra');
var archiver = require('archiver');

class Reader {
	constructor(){
		this.systemFilePathIndex = JSON.parse(fs.readFileSync('systemFilePathIndex.json', 'utf8'));
		this.systemFilePathIndexLength = this.systemFilePathIndex.length;
	}

	Read(filePath){
		var pathSplit = filePath.split("/");
		console.log(filePath);
		if(pathSplit[1] === "preview" && pathSplit[2] === "data"){
				pathSplit.splice(1,1);
				filePath = pathSplit.join("/");
		}
		var state = this.PathIndexCheck(__dirname,filePath);
		console.log(state.state);
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
		for (var i = 0; i < this.systemFilePathIndexLength; i++){
			if(this.systemFilePathIndex[i] === filePath) {
				console.log("systemFile" + this.systemFilePathIndex[i] + " : "+  filePath);
				return {state:true,count:0};
			}
		}
		
		var splitedFilePath = filePath.split("/");

		if(splitedFilePath[1] === "preview"){
			splitedFilePath.splice(1,1);
			console.log(splitedFilePath);
		}

		try {
			var filePathIndex = JSON.parse(fs.readFileSync(directoryPath +  '/pathIndex.json', 'utf8'));
			console.log("r/w 32 : " + filePathIndex);
		}
		catch(err){
			var filePathIndex = [];
			console.log( "r/w 33 : " + err);
			return {state:false,count:1};
		}
		var filePathIndexLength = filePathIndex.length;


		if(splitedFilePath.length === 0){return {state:false,count:1};}

		for (var i = 0; i < filePathIndexLength ; i ++){
			if(filePathIndex[i] === "/" + splitedFilePath[1]){
				console.log("r/w 41 : " + splitedFilePath.length);
				if(splitedFilePath.length > 2){
					var reqDirectoryPath = directoryPath +"/"+ splitedFilePath[1];
					splitedFilePath.shift();
					splitedFilePath.shift();
					splitedFilePath = splitedFilePath.join("/");
					var returnData = this.PathIndexCheck(reqDirectoryPath,"/" + splitedFilePath);
					returnData.count++;
					return returnData
				}else{
					return {state:true,count:1};
				}
			}
		}

		return {state:false,count:1};
	}

	Zip(filePath,writer){
		 var state = this.PathIndexCheck(__dirname,filePath);
		 if(!state.state){
		 		var pathSplit = filePath.split(".");
			 	pathSplit.pop();
		 		var zipPath = pathSplit.join(".");
				var fileName = filePath.split("/");
				fileName = fileName[fileName.length-1] + ".zip";
				writer.WriteEnd(__dirname + zipPath);
				writer.CreateZip(__dirname + zipPath);
				setTimeout(console.log("!!!"),5000);
		 }
		return this.Read(filePath+fileName);
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
		var state = this.PathIndexCheck(__dirname ,  "/data"+filePath);
		console.log("r/w :86 : " + state.count);

		if(!state.state){
			fsExtra.mkdirsSync(__dirname + "/" + directoryPathString);
			console.log("r/w :88 : " + __dirname +"/"+ directoryPathString);

			for(var i = state.count; i < splitedFilePathLength-1; i++){
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
				JsonData.push("/" + splitedFilePath[i]);
				fs.writeFileSync(__dirname + path + '/pathIndex.json', JSON.stringify(JsonData));
			}
		}
		var state = this.PathIndexCheck(__dirname +"/"+ directoryPathString ,fileName);
		if(!state.state){
			fs.writeFileSync(__dirname +"/"+ directoryPathString + fileName	,this.data);
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

	CreateZip(directoryPath){
		var archive = archiver.create('zip', {});
		
		var zipName = directoryPath.split("/");
		zipName = zipName[zipName.length-1] + ".zip"
		var output = fs.createWriteStream(directoryPath +"/"+ zipName );
		
		archive.pipe(output);

		archive.directory(directoryPath+"/");

		//output.on("close", callback)

		archive.finalize();
		output.end();
	}
}


module.exports = { Writer : Writer , Reader : Reader};
