(window.onload = function(){
	var userId = "0";
	var upload = document.getElementById('upload');

upload.addEventListener('click', function () {
	var uploadFile = document.getElementById('upload-file');
	var fileLength = uploadFile.files.length;
	if (fileLength === 0){
		 alert('ファイルを選択してください。');
	}else{
		for(var i = 0; i < fileLength;i++){
			var file = uploadFile.files[i];
				var request = new XMLHttpRequest();
				request.open('POST', 'http://localhost:3000/'+ userId +'/upload/'+ file.name);
				request.addEventListener("load",function(ev){console.log("request comp!" + file.name)});
				request.send(file);
			
		}
	}
});
})();
