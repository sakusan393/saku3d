/**
 * Created by 393 on 2016/03/13.
 */
ImageLoader = {
    length: 0,
    counter: 0,
    images: {},
    isLoading:false,
    _callback: function(){},

    load: function (pathArray, callback) {
        this.counter = 0;
        this.isLoading = true;
        this._callback = callback;
        this.length = pathArray.length;
        for (var i = 0; i < this.length; i++) {
            //load済みかのチェック
            var id = pathArray[i];
            if(! ImageLoader.images[id]){
                var img = new Image();
                img.onload = this._loaded;
                img.src = pathArray[i];
                img.srcSrc = pathArray[i];
            }else{
                ImageLoader._checkCount();
            }
        }
    },
    _loaded: function(event){
        var id = event.target.srcSrc;
        ImageLoader.images[id] = event.target;
        ImageLoader._checkCount();
    },
    _checkCount: function(event) {
        ImageLoader.counter++;
        if (ImageLoader.counter >= ImageLoader.length) {
            ImageLoader.isLoading = false;
            ImageLoader._callback();
        }
    }
};
