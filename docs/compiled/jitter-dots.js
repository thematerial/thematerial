"use strict";

var jitterDotsRandNumber = function jitterDotsRandNumber(min, max) {
  var num = Math.floor(Math.random() * max) + min;
  return num <= min ? min : num;
};

var jitterDotElems = document.querySelectorAll('.jitter-dots');

var createDots = function createDots() {
  var jdElems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : jitterDotElems;

  for (var i = 0; i < jdElems.length; i++) {
    var jdElem = jdElems[i];

    for (var r = 0; r < jitterDotsRandNumber(3, 6); r++) {
      var dotElem = document.createElement('span');
      dotElem.className = 'dot';
      jdElem.appendChild(dotElem);
    }
  }
};

var removeDots = function removeDots() {
  var dotsInJitterDotsElem = document.querySelectorAll('.jitter-dots .dot');

  for (var i = 0; i < dotsInJitterDotsElem.length; i++) {
    var dotElem = dotsInJitterDotsElem[i];
    dotElem.remove();
  }
};

var spreadDots = function spreadDots() {
  var jdElems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : jitterDotElems;

  for (var i = 0; i < jdElems.length; i++) {
    var jdElem = jdElems[i];
    var _ref = [jdElem.clientHeight, jdElem.clientWidth],
        maxTop = _ref[0],
        maxLeft = _ref[1];
    var dotElems = jdElem.querySelectorAll('.dot');

    for (var _i = 0; _i < dotElems.length; _i++) {
      var dotElem = dotElems[_i];

      if (jitterDotsRandNumber(0, 3) > 0) {
        // only move sometimes
        dotElem.style.top = jitterDotsRandNumber(0, maxTop) + 'px';
        dotElem.style.left = jitterDotsRandNumber(0, maxLeft) + 'px';
        dotElem.style.padding = jitterDotsRandNumber(1, 3) + 'px'; // dot size
      }
    }
  }
};

createDots();
setInterval(function () {
  return spreadDots(document.querySelectorAll('.jitter-dots'));
}, 2000); // query dots on now to get exacts size if changed since then
//# sourceMappingURL=jitter-dots.js.map