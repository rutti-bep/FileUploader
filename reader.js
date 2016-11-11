"use strict";
var fs = require("fs");

class Reader {
	Read(filePathArray){
		var returnData;
		var filePath = __dirname + "/" + filePathArray.join("/");
		try{
			returnData = fs.readFileSync(filePath);
		}catch(err){
			console.log(err);
		}
		return returnData;
	}
}

module.exports = {Reader:Reader};
