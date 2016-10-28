(window.onload = function(){
 var dirctoryArray = ["/pathIndex.json"];
 var dotRegExp = /(\.\D)/;
 var pmdRegExp = /((\.pmd)|(\.pmx))$/;
 var vmdRegExp = /(\.vmd)$/;
 request("data" + dirctoryArray.join(""));

 var button = document.createElement( "BUTTON" ); 
 button.textContent = "run";
 button.addEventListener("click",run,false); 
 document.getElementById( "run" ).appendChild( button );    
 console.log("!!!!!");

 function onClick(addPath,arrayLength){
 return function(){
 if(dirctoryArray.length !== arrayLength){
	 var length = dirctoryArray.length;
	 for (var i = arrayLength; i < length ; i++){
			var id = i.toString();
			var element = document.getElementById(id)
			element.parentNode.removeChild(element);
	 }
	 dirctoryArray = dirctoryArray.slice(0,arrayLength);
 }
 dirctoryArray[dirctoryArray.length-1] = addPath;
 dirctoryArray.push('/pathIndex.json');
 request("data" + dirctoryArray.join(""));
 console.log(dirctoryArray);
 }
 }

 function pmdSet(path){
 return function(){
var pathArray = dirctoryArray.slice(0,dirctoryArray.length-1);
 modelFile = "data" +  pathArray.join("") + path;
 alert("pmdSet : " + "data" + decodeURIComponent(pathArray.join("") + path));	
 }
 }

 function vmdSet(path){
	 return function(){
		var pathArray = dirctoryArray.slice(0,dirctoryArray.length-1);
		 stockVmdFiles = ["data" + pathArray.join("") + path];
		 vmdFiles = ["data" + pathArray.join("") + path];
		 alert("vmdSet : " + "data" + decodeURIComponent(pathArray.join("") + path));	
	 }
 }

 function request(reqPath,catchFunction){
	 var request = new XMLHttpRequest();
	 request.open('POST', 'http://localhost:3000/' + reqPath);
	 request.addEventListener("load",
			 function(ev){
			 var response = JSON.parse(ev.srcElement.response);
			 var div = document.createElement( "div" );
			 div.id = dirctoryArray.length - 1;
			 div.className  = dirctoryArray.length % 2 === 0 ? "even" : "odd" ;
			 for(var i = 0; i < response.length; i ++){
				 if(pmdRegExp.exec(response[i])){
			 var button = document.createElement( "BUTTON" );
			 button.textContent = decodeURIComponent(response[i]);
			 button.addEventListener("click",pmdSet(response[i]),false);
			 div.appendChild( button );
			 }else if(vmdRegExp.exec(response[i])){
			 var button = document.createElement( "BUTTON" );
			 button.textContent = decodeURIComponent(response[i]);
			 button.addEventListener("click",vmdSet(response[i]),false);
			 div.appendChild( button );
			 }else if(!dotRegExp.exec(response[i])){
			 var button = document.createElement( "BUTTON" );
			 button.textContent = decodeURIComponent(response[i]);
			 button.addEventListener("click",onClick(response[i],dirctoryArray.length),false);
			 div.appendChild( button );
			 }
			 
			 }
			 document.getElementById( "buttons" ).appendChild( div );
			 console.log(response);
			 });
	 request.send();
 }

})
