"use strict";
var reader = require("./reader");
var writer = require("./writer");
var indexchecker = require("./indexchecker");
var perser = require("./perser");

class RWManager {
	constructor(){
		this.reader = new reader.Reader();
		this.writer = new writer.Writer();
		this.indexChecker = new indexchecker.IndexChecker();
		this.perser = new perser.Perser();
	}

	Read(filePath){
		var fileType = filePath.split(".");
		fileType = fileType[fileType.length-1];
		var filePathArray = this.perser.Perse(filePath);
		console.log(filePathArray)
		var result = this.indexChecker.Check(filePathArray);
		var data = null;
		console.log(result);
		if(result.exist){
			switch(fileType){
				case "zip":
					data = "hogehoge";
				break;
				default:
					data = this.reader.Read(filePathArray);
				break;
			}
		}
		return data;
	}

	Write(filePath,data){
		var filePathArray = this.perser.Perse(filePath);
		var fileName = filePathArray.splice(filePathArray.length-1,1);
		var result = this.indexChecker.Check(filePathArray);
		console.log(filePathArray);
		console.log(result);
		if(!result.exist){
			this.writer.DirectoryDig(filePathArray,result);
		}
		this.writer.Write(filePathArray,fileName,data);
	}
}

module.exports = {RWManager : RWManager};
