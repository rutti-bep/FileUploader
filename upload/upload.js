(window.onload = function(){
	var userId = "0";
	var upload = document.getElementById('upload');

upload.addEventListener('click', function () {
	var uploadFile = document.getElementById('upload-file');
	var file = uploadFile.files[0];
	if (!file) alert('ファイルを選択してください。');

	var request = new XMLHttpRequest();
	request.open('POST', 'http://localhost:3000/'+ userId +'/upload/'+ file.name);
	request.addEventListener("load",function(ev){console.log("request comp!")});
	request.send(file);
});
})();
