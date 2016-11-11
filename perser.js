"use strict";

class Perser{
	Perse(filePath){
		var filePathArray = filePath.split("/");
		var dirnameArray = __dirname.split("/");
		var dirnameLength = dirnameArray.length;
		var filePathInDirname = true;
		for	(var i = 0; i < dirnameLength; i++){
			if(dirnameArray[i] !== filePathArray[i]){
				filePathInDirname = false;
				break;
			}
		}
		console.log("");
		if(filePathArray[0] === ""){
			filePathArray.shift();
		}
		if(filePathInDirname){
				filePathArray.splice(0,dirnameLength-1);
				console.log("perser:20 : "+ dirnameLength);
		}
		var filePathArrayLength = filePathArray.length;
		for (var i = 0; i < filePathArray-1 ; i++){
			if(filePathArray[i] === "preview" && filePathArray[i+1] === "data"){
				filePathArray.splice(i,1);
				break;
			}
		}
		return filePathArray;
	}
}

module.exports = {Perser:Perser};
