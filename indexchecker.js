"use strict";
var fs = require("fs");

class IndexChecker {
	constructor(){
		this.systemFilePathIndex = JSON.parse(fs.readFileSync('systemFilePathIndex.json', 'utf8'));
		this.systemFilePathIndexLength = this.systemFilePathIndex.length;
		this.dirNameArray = __dirname.split("/");
		this.dirNameArrayLength = this.dirNameArray.length-1;
	}

	Check(filePathArray){
		var copiedFilePathArray = filePathArray.concat();
		var copiedFilePathArrayLength = copiedFilePathArray.length;
		for (var i = 0; i < this.systemFilePathIndexLength; i++){
			if(this.systemFilePathIndex[i] === "/" +	copiedFilePathArray.join("/")) {
		 		return {exist:true};
			}
		}
		if(this.dirNameArrayLength < copiedFilePathArrayLength){
			for(var i = 0; i < this.dirNameArrayLength; i++){
			copiedFilePathArray.splice(0,this.dirNameArrayLength);
			}
		}
		return RecursionCheck(this.dirNameArray,copiedFilePathArray);
	}
}

var RecursionCheck = function(directoryPathArray, remainPathArray){
	console.log("indexchecker.js:30 : "+ directoryPathArray  + " : " + remainPathArray);
	var directoryPath = directoryPathArray.join("/");
	var filePathIndex = [];
	var filePathIndexLength = 0;
	try {
		filePathIndex = JSON.parse(fs.readFileSync(directoryPath +  '/pathIndex.json', 'utf8'));
		filePathIndexLength = filePathIndex.length;
	}catch(err){
		console.log(err);
		return {exist:false,count:0};
	}

	for(var i = 0; i < filePathIndexLength; i++){
		console.log("indexchecker.js:39 : " + filePathIndex[i] + ":" + remainPathArray[0]);
		if(filePathIndex[i] === remainPathArray[0]){
			if(remainPathArray.length > 1){
				directoryPathArray.push(remainPathArray.shift());	
				var returnData = RecursionCheck(directoryPathArray,remainPathArray);
				returnData.count++;
				return returnData;
			}else{
				return {exist:true,count:1};
			}
		}

	}
	return {exist:false,count:0};	
}

module.exports = {IndexChecker: IndexChecker};
