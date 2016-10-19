"use strict";
var fs = require('fs');

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
		fs.writeFileSync(__dirname + "/data/" + filePath,this.data,'binary');	
	}
}

class Reader {
		constructor(){
			this.cache = {};
		}

		start(filePath){
			if(this.cacheCheck(filePath)){
				return this.cache[filePath];
			}else{
				var data = fs.readFileSync(__dirname + filePath,'binary');
				this.cache[filePath] = data;
				return data;
			}
		}

		cacheCheck(filePath){
			if(this.cache[filePath]){
				return true;
			}else{
				return false;
			}
		}
}

module.exports = { Writer : Writer , Reader : Reader};
