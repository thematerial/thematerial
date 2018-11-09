var randNumber = function randNumber(min, max) {
  var num = Math.floor(Math.random() * max) + min;
  return num <= min ? min : num;
};

var jitterDotElems = document.querySelectorAll('.jitter-dots');

var createDots = function createDots() {
  var jdElems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : jitterDotElems;
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = jdElems[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var jdElem = _step4.value;

      for (var i = 0; i < randNumber(3, 6); i++) {
        var dotElem = document.createElement('span');
        dotElem.className = 'dot';
        jdElem.appendChild(dotElem);
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }
};

var removeDots = function removeDots() {
  var dotsInJitterDotsElem = document.querySelectorAll('.jitter-dots .dot');
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = dotsInJitterDotsElem[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var dotElem = _step5.value;
      dotElem.remove();
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }
};

var spreadDots = function spreadDots() {
  var jdElems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : jitterDotElems;
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = jdElems[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var jdElem = _step6.value;
      var _ref2 = [jdElem.clientHeight, jdElem.clientWidth],
          maxTop = _ref2[0],
          maxLeft = _ref2[1];
      var dotElems = jdElem.querySelectorAll('.dot');
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = dotElems[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var dotElem = _step7.value;

          // console.log(randNumber(0,1))
          if (randNumber(0, 3) > 0) {
            // only move sometimes
            dotElem.style.top = randNumber(0, maxTop) + 'px';
            dotElem.style.left = randNumber(0, maxLeft) + 'px';
            dotElem.style.padding = randNumber(1, 3) + 'px'; // dot size
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }
};

createDots();
setInterval(function () {
  return spreadDots(document.querySelectorAll('.jitter-dots'));
}, 2000); // query dots on now to get exacts size if changed since then
