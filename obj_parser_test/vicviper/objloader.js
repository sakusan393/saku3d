;var objLoader = {};
(function() {
	// XHRを使ってOBJファイルを取得する
	var fileCount = 0;
	objLoader.load = function(srcFiles,cb) {
		var callback = function() {
			fileCount--;
			if(fileCount == 0) {
				// 全ファイルがロードされたら初期化
				cb();
			}
		};
		loadFile(srcFiles.obj, "obj", callback);
		loadFile(srcFiles.mtl, "mtl", callback);
	};
	objLoader.files = {};
	var loadFile = function(url, name, callback) {
		fileCount++;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				objLoader.files[name] = xhr.responseText;
				callback();
			}
		};
		xhr.open("GET", url, true);
		xhr.send("");
	};
})();
