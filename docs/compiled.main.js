"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isMobile = typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1;
var bodyElem = document.querySelector('body');
var pageElem = bodyElem.querySelector('#page');
var videoElem = document.querySelector('#video-intro');
var videoPlayer = videoElem.querySelector('#video-player');

var swapScene = function swapScene() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      timer = _ref.timer,
      scene = _ref.scene;

  var callbackFn = arguments.length > 1 ? arguments[1] : undefined;
  return new Promise(function (resolve) {
    return setTimeout(function () {
      if (scene) bodyElem.className = scene;
      if (typeof callbackFn === 'function') callbackFn();
      resolve();
    }, timer || 0);
  });
};

videoPlayer.addEventListener('timeupdate', videoTimeUpdate = function (_videoTimeUpdate) {
  function videoTimeUpdate() {
    return _videoTimeUpdate.apply(this, arguments);
  }

  videoTimeUpdate.toString = function () {
    return _videoTimeUpdate.toString();
  };

  return videoTimeUpdate;
}(function () {
  console.log('ywH');
  swapScene({
    timer: 0,
    scene: 'display-video-intro'
  });
  videoPlayer.removeEventListener('timeupdate', videoTimeUpdate, false);
}));
videoPlayer.addEventListener('ended', function () {
  return videoIntroEnd();
});

var videoIntroEnd = function videoIntroEnd() {
  return swapScene({
    timer: 0,
    scene: 'display-video-intro display-skip-video-intro display-acquisition'
  }).then(function () {
    return swapScene({
      timer: 2500
    }, function () {
      return videoElem.remove();
    });
  }).then(function () {
    return swapScene({
      timer: 4000,
      scene: 'display-page'
    });
  });
}; // videoIntroEnd() // <-- remove for video play at start


var sequenceElem = document.querySelector('#sequence');

var startSequence = function startSequence() {
  var timer = 3000;
  goInFullscreen(bodyElem);
  diasTheEnd(false);
  swapScene({
    timer: 0,
    scene: 'display-sequence-intro pt1'
  }).then(function () {
    return swapScene({
      timer: timer,
      scene: 'display-sequence-intro pt2'
    });
  }).then(function () {
    return swapScene({
      timer: timer,
      scene: 'display-sequence-intro pt2 display-dias'
    }, function () {
      return changeImage(0, 0);
    });
  });
};

var goInFullscreen = function goInFullscreen(element) {
  if (element.requestFullscreen) element.requestFullscreen();else if (element.mozRequestFullScreen) element.mozRequestFullScreen();else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();else if (element.msRequestFullscreen) element.msRequestFullscreen();
};

var goOutFullscreen = function goOutFullscreen(element) {
  if (document.exitFullscreen) document.exitFullscreen();else if (document.mozCancelFullScreen) document.mozCancelFullScreen();else if (document.webkitExitFullscreen) document.webkitExitFullscreen();else if (document.msExitFullscreen) document.msExitFullscreen();
};
/**
 * DIAS 
*/


var dias = {
  currIdx: 0
};
var diasElem = document.querySelector('#dias');
var diasBarInnerElems = document.querySelectorAll('#dias .bar-inner');
var btnImagePrevNextElem = document.querySelector('#btn-image-prev-next');
var imageElems = diasElem.querySelector('#image-provider').querySelectorAll('img');
var imageSrcEle = diasElem.querySelector('#image-src');
var imageMainEle = diasElem.querySelector('#image-main');
var imageOptionElem = diasElem.querySelector('.image-option');
var imageTitleTxtElem = diasElem.querySelector('h1.image-title');
var imageDimensionsTxtElem = diasElem.querySelector('p.image-details .image-dimensions');
var imageMaterialTxtElem = diasElem.querySelector('p.image-details .image-material');
var imageZoomLevelElem = diasElem.querySelector('#image-zoom-level');
var pzArea = document.querySelector('#image-src');
var pz = panzoom(pzArea, {
  maxZoom: 3.33,
  minZoom: 1,
  zoomSpeed: isMobile ? 0.077 : 0.02,
  smoothScroll: false,
  onTouch: function onTouch() {
    return false;
  }
});
var imageSrcList = Array.from(imageElems).map(function (img) {
  return Object.assign(_objectSpread({}, img.dataset, {
    src: img.src,
    title: img.title
  }));
});
var removeBarInnerActiveTimer;
var isMouseDown = false;

var changeImage = function changeImage(dest) {
  var currIdx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : dias.currIdx;
  changeZoomLevel(0);
  var nextIdx = currIdx + dest;
  btnImagePrevNextElem.querySelector('.btn-prev').disabled = nextIdx <= 0;
  if (nextIdx < 0) return;else if (nextIdx > imageSrcList.length - 1) {
    return diasTheEnd(true);
  }
  var img = imageSrcList[nextIdx];
  dias.currIdx = nextIdx;
  imageSrcEle.style.backgroundImage = "url(".concat(img.src, ")");
  imageTitleTxtElem.innerText = img.title;
  imageDimensionsTxtElem.innerText = img.dimensions;
  imageMaterialTxtElem.innerText = img.material;
  clearTimeout(removeBarInnerActiveTimer);
  showGUI(false, 3300);
  pz.moveTo(0, 0);
  setTimeout(function () {
    return pzArea.focus();
  }, 2200);
};

var diasTheEnd = function diasTheEnd(theEnd) {
  var diasTheEndElem = diasElem.querySelector('#dias-the-end');

  if (theEnd) {
    diasTheEndElem.className = "active";
    setTimeout(function () {
      return diasTheEndElem.className = "active display-close";
    }, 4200);
  } else {
    diasTheEndElem.className = "";
  }
};

var guiIsShowing = false;

var showGUI = function showGUI(event, removeTimer) {
  clearTimeout(removeBarInnerActiveTimer);
  var isImageContent = event && event.target.id === 'image-content';

  if (isMouseDown == false) {
    diasBarInnerElems.forEach(function (ele) {
      return ele.className = 'bar-inner active';
    });
    btnImagePrevNextElem.style.display = 'block';
    guiIsShowing = true;
  }

  removeBarInnerActiveTimer = setTimeout(function () {
    if (isMobile || isImageContent) {
      hideGUI();
    }
  }, removeTimer || 720);
};

var hideGUI = function hideGUI() {
  diasBarInnerElems.forEach(function (ele) {
    return ele.className = 'bar-inner';
  });
  btnImagePrevNextElem.style.display = 'none';
  guiIsShowing = false;
};

var diasClose = function diasClose() {
  goInFullscreen(diasElem);
  goOutFullscreen(bodyElem);
  swapScene({
    timer: 0,
    scene: 'display-page'
  });
};

if (!isMobile) {
  diasElem.addEventListener('keydown', function (e) {
    if (e.code == 'Digit0' || e.code == 'Escape') {
      changeZoomLevel(0);
      pz.moveTo(0, 0);
    }

    if (e.code == 'Space') {// Bring to center ?
    }
  });
  diasElem.addEventListener('keyup', function (e) {
    var scale = pz.getTransform().scale;
    if (scale > 1) return;
    if (e.code == 'ArrowLeft') changeImage(-1);
    if (e.code == 'ArrowRight') changeImage(+1);
  });
  diasElem.addEventListener('mousemove', function (event) {
    showGUI(event);
  });
  diasElem.addEventListener('mousedown', function (event) {
    isMouseDown = true;
    var isImageContent = event.target.id === 'image-content';
    if (isImageContent) hideGUI(event);
  });
  diasElem.addEventListener('mouseup', function (event) {
    isMouseDown = false;
    var scale = pz.getTransform().scale;
    imageZoomLevelElem.value = scale;
  });
  diasElem.addEventListener('mousewheel', function (event) {
    var scale = pz.getTransform().scale;
    imageZoomLevelElem.value = scale;
  });
} else {
  var touchShowGUITimer;
  var longTouchTimer;
  var isLongTouch = false;
  diasElem.addEventListener('panstart', function () {
    clearTimeout(touchShowGUITimer);
    hideGUI(); // hide gui when moving picture
  });
  diasElem.addEventListener('touchstart', function (e) {
    clearTimeout(longTouchTimer);
    clearTimeout(touchShowGUITimer);
    isLongTouch = false;
    if (e.target.type === 'button') return; // when target is button skip further logic

    if (guiIsShowing) {
      clearTimeout(removeBarInnerActiveTimer);
      hideGUI();
    } else {
      longTouchTimer = setTimeout(function () {
        return isLongTouch = true;
      }, 325);
      touchShowGUITimer = setTimeout(function () {
        if (isLongTouch === false) showGUI(false, 3300);
      }, 330);
    }
  });
  diasElem.addEventListener('touchend', function (e) {
    clearTimeout(longTouchTimer);

    if (isLongTouch) {
      clearTimeout(touchShowGUITimer);
    }
  });
}

setInterval(function () {
  // workaround to deny pan/move when image is not zoomed
  var scale = pz.getTransform().scale;
  imageZoomLevelElem.value = scale;
  if (scale == 1) pz.moveTo(0, 0);
}, 2);
var changeZoomFocusTimer;

var changeZoomLevel = function changeZoomLevel(zoomValue) {
  clearTimeout(changeZoomFocusTimer);
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  pz.zoomAbs(windowWidth / 2, windowHeight / 2, zoomValue);
  if (zoomValue == 1) pz.moveTo(0, 0); // center

  changeZoomFocusTimer = setTimeout(function () {
    return pzArea.focus();
  }, 720);
};

var isExhibition = window.location.search.includes('exhibition');

if (isExhibition) {
  imageOptionElem.remove();
  videoIntroEnd(true);
  startSequence();
}

var randNumber = function randNumber(min, max) {
  var num = Math.floor(Math.random() * max) + min;
  return num <= min ? min : num;
};

var languageTextElems = document.querySelectorAll('[data-da]');
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = languageTextElems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var langTextElem = _step.value;
    // must run before jitter create dots, or it will produce 'dot elements' in dataset.en
    langTextElem.dataset.en = langTextElem.innerHTML;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return != null) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

var activeLanguageElem = document.querySelector('.active-language');

var setLanguage = function setLanguage(lang) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = languageTextElems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var langTextElem = _step2.value;
      activeLanguageElem.className = 'active-language ' + lang;
      langTextElem.innerHTML = langTextElem.dataset[lang];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = langTextElem.querySelectorAll('p')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var p = _step3.value;
          p.className = "jitter-dots";
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  removeDots();
  createDots(document.querySelectorAll('.jitter-dots'));
};

pageElem.addEventListener('scroll', function (e) {
  var styleDisplay = e.target.scrollTop > 40 ? 'none' : 'block';
  activeLanguageElem.style.display = styleDisplay;
});
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

//# sourceMappingURL=compiled.main.js.map