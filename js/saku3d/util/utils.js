/**
 * Created by 393 on 2016/03/14.
 */
var inherits = function (childCtor, parentCtor) {
  Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
};

if (window.requestAnimationFrame === undefined || window.cancelAnimationFrame === undefined) {
  requestAnimationFrame = function (callback) {
    var currTime = Date.now(), timeToCall = Math.max(0, 16 - ( currTime - lastTime ));
    var id = self.setTimeout(function () {
      callback(currTime + timeToCall);

    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}


var CLOCK = {
  start: Date.now(),
  prevTime: 0,
  getElapsedTime: function(){
    this.prevTime = Date.now();
    return this.prevTime - this.start;
  },
  getDelta: function(){
    return Date.now() - this.prevTime;
  }
}
