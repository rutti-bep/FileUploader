var stats;
var mesh, camera, scene, renderer, clock, windowWidth, windowHeight;
var helper;
var controls;
var modelReady = false;
var modelFile = 'models/pmd/lat_miku.pmd';
var vmdFiles = ['models/vmd/nekomimi_lat.vmd'];		 
var stockVmdFiles;
var animationFlameId;

var isDebug = false;
var isWindowMake = false;

function run(){
	init();
	render();
}

function stop(){
	cancelAnimationFrame( animationFlameId );
}

function init() {
	windowWidth = window.innerWidth*3/10;
	windowHeight = window.innerHeight*1/2;
	clock = new THREE.Clock();
	stockVmdFiles = vmdFiles.concat();
	// シーンの作成
	scene = new THREE.Scene();
	if(isDebug){
		// FPSの表示
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		stats.domElement.style.zIndex = 100;
		document.getElementById( "run" ).appendChild(stats.domElement);
	}
	// 光の作成
	var ambient = new THREE.AmbientLight(0xeeeeee);
	scene.add(ambient);

	// 画面表示の設定
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(windowWidth, windowHeight);
	renderer.setClearColor(new THREE.Color( 0x555555));
	renderer.domElement.id = "renderer";
	if(isWindowMake){
		var element = document.getElementById("renderer");
		element.parentNode.removeChild(element);   
	}
	isWindowMake = true;
	document.getElementById( "run" ).appendChild(renderer.domElement);

	// カメラの作成
	camera = new THREE.PerspectiveCamera(50, windowWidth / windowHeight, 1, 1000);
	camera.position.set(0, 10, 35);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 10;
	controls.maxDistance = 60;
	controls.maxPolarAngle = Math.PI * 0.5;

	// モデルとモーションの読み込み準備
	helper = new THREE.MMDHelper(renderer);
	var onProgress = function (xhr) {
	};
	var onError = function (xhr) {
		alert('読み込みに失敗しました。');
	};

	// モデルとモーションの読み込み
	var loader = new THREE.MMDLoader();
	loader.load(modelFile, vmdFiles, function(object) {
			modelReady = true;
			mesh = object;
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.position.set(0, -10, 0);
			helper.add(mesh);
			helper.setAnimation(mesh);

			helper.setPhysics(mesh);
			helper.unifyAnimationDuration({
afterglow: 2.0
});
			
			vmdFiles = stockVmdFiles.concat();
			scene.add(mesh);
			}, onProgress, onError);
}

// リサイズ時
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
	windowWidth = window.innerWidth*3/10;
	windowHeight = window.innerHeight*1/2;
	camera.aspect = windowWidth / windowHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(windowWidth, windowHeight);
}

function render() {
	animationFlameId = requestAnimationFrame(render);
	if(modelReady) {
		helper.animate(clock.getDelta());
		helper.render(scene, camera);
	} else {
		renderer.clear();
		renderer.render(scene, camera);
	}
	if(isDebug){
		stats.update();
	}
	controls.update();
}

