"use strict";
var fs = require('fs-extra');


class Writer {
	constructor(){
	}
	
	start(){
		this.data = new Buffer('');
	}

	add(data){
		this.data = Buffer.concat([this.data,data]);
	}

	end(filePath){
		var filePathList = JSON.parse(fs.readFileSync(__dirname + '/filePathList.json', 'utf8'));
		var filePathLength = filePathList.length;
		var isWritten = false;
		for (var i = 0; i < filePathLength; i ++){
				if(filePathList[i] === filePath){
					isWritten = true;
					console.log(filePathList[i]  + " : " + filePath);
					console.log("match =====================================");
					break;
				}
		}
		if (!isWritten){
		var directoryPath = filePath.split("/");
		var filename = directoryPath.pop();
		directoryPath =  __dirname + "/data/" + directoryPath.join("");

		fs.mkdirsSync(directoryPath);
		var jsonData = fs.readFile('filePathList.json', 'utf8');
		fs.writeFileSync(directoryPath + filename,this.data,'binary');
		
		if(filePathList[0] === null){
			filePathList[0] = filePath;
		}else{
			filePathList[filePathList.length] = filePath;
		}
		console.log(filePath);
		fs.writeFileSync(__dirname + '/filePathList.json', JSON.stringify(filePathList));
		}
	}
}

class Reader {
		constructor(){
			this.systemFilePathList = JSON.parse(fs.readFileSync('systemFilePathList.json', 'utf8'));
		}

		start(filePath){
			var filePathList = JSON.parse(fs.readFileSync(__dirname + '/filePathList.json', 'utf8'));
			if(filePathList[filePath] || this.systemFilePathList){
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
}

module.exports = { Writer : Writer , Reader : Reader};
