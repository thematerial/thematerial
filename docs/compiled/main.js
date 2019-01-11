"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isMobile = typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1;

var isIeOrEdgeBrowser = function isIeOrEdgeBrowser() {
  var isIE =
  /*@cc_on!@*/
  false || !!document.documentMode;
  var isEdge = !isIE && !!window.StyleMedia;
  return isIE || isEdge;
};

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

var videoIntroOnPlay = function videoIntroOnPlay() {
  swapScene({
    timer: 0,
    scene: 'display-video-intro'
  });
  videoPlayer.removeEventListener('canplay', videoOnCanPlay, false);
  videoPlayer.removeEventListener('timeupdate', videoIntroOnPlay, false); // discovered that at times "canplay" does not fire (firefox it occured) check if video time is updated as canplay
};

var videoOnCanPlay = function videoOnCanPlay() {
  setTimeout(function () {
    if (videoPlayer.paused) {
      swapScene({
        timer: 0,
        scene: 'display-video-intro display-play-btn'
      });
    }
  }, 100);
  videoPlayer.removeEventListener('canplay', videoOnCanPlay, false);
};

var videoIntroPlay = function videoIntroPlay() {
  return videoPlayer.play();
};

videoPlayer.addEventListener('timeupdate', videoIntroOnPlay);
videoPlayer.addEventListener('canplay', videoOnCanPlay);
videoPlayer.addEventListener('ended', function () {
  return videoIntroEnd();
});
var destroyVideoTimer = setTimeout(function () {
  if (videoPlayer.paused) {
    // if video havent played yet at this time, just end it.
    videoIntroEnd();
  }
}, 20000); // 20000 -- 20 s

var videoIntroEnd = function videoIntroEnd() {
  clearTimeout(destroyVideoTimer);
  videoPlayer.removeEventListener('timeupdate', videoIntroOnPlay, false);
  videoPlayer.removeEventListener('canplay', videoOnCanPlay, false);
  swapScene({
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
};

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
var imageSrcEle = diasElem.querySelector('#image-src #image-content');
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
  clearTimeout(removeBarInnerActiveTimer);
  showGUI(false, 3300);
  if (nextIdx < 0) return;else if (nextIdx > imageSrcList.length - 1) {
    dias.currIdx = dias.currIdx >= imageSrcList.length ? dias.currIdx : nextIdx;
    /* 
    treat "the end" as if was part of image sequence, so add to the dias current idx.
    when try to skip to next image deny when, reached the end
    */

    return diasTheEnd(true);
  }
  diasTheEnd(false);
  var img = imageSrcList[nextIdx];
  dias.currIdx = nextIdx;
  imageSrcEle.style.backgroundImage = "url(".concat(img.src, ")");
  imageTitleTxtElem.innerText = img.title;
  imageDimensionsTxtElem.innerText = img.dimensions;
  imageMaterialTxtElem.innerText = img.material;
  pz.moveTo(0, 0);
  setTimeout(function () {
    return pzArea.focus();
  }, 2200);
};

var diasTheEnd = function diasTheEnd(isEnd) {
  if (isEnd) {
    diasElem.className = 'display-dias-the-end';
    btnImagePrevNextElem.querySelector('.btn-next').disabled = true;
  } else {
    diasElem.className = '';
    btnImagePrevNextElem.querySelector('.btn-next').disabled = false;
  }
};

var guiIsShowing = false;

var showGUI = function showGUI(event, removeTimer) {
  clearTimeout(removeBarInnerActiveTimer);
  var isImageContent = event && event.target.id === 'image-content';

  if (isMouseDown == false) {
    // for(let ele of diasBarInnerElems) ele.className = 'bar-inner active'
    for (var i = 0; i < diasBarInnerElems.length; i++) {
      var ele = diasBarInnerElems[i];
      ele.className = 'bar-inner active';
    }

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
  for (var i = 0; i < diasBarInnerElems.length; i++) {
    var ele = diasBarInnerElems[i];
    ele.className = 'bar-inner';
  }

  btnImagePrevNextElem.style.display = 'none';
  guiIsShowing = false;
};

var diasClose = function diasClose() {
  goOutFullscreen(bodyElem);
  swapScene({
    timer: 0,
    scene: 'display-page'
  });
};

if (isIeOrEdgeBrowser()) {
  sequenceElem.className = 'ie-or-edge';
}

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

var languageTextElems = document.querySelectorAll('[data-da]');

for (var i = 0; i < languageTextElems.length; i++) {
  // must run before jitter create dots, or it will produce 'dot elements' in dataset.en
  var langTextElem = languageTextElems[i];
  langTextElem.dataset.en = langTextElem.innerHTML;
}

var activeLanguageElem = document.querySelector('.active-language');

var setLanguage = function setLanguage(lang) {
  for (var _i = 0; _i < languageTextElems.length; _i++) {
    var _langTextElem = languageTextElems[_i];
    activeLanguageElem.className = 'active-language ' + lang;
    _langTextElem.innerHTML = _langTextElem.dataset[lang];

    var paragraphElems = _langTextElem.querySelectorAll('p');

    for (var _i2 = 0; _i2 < paragraphElems.length; _i2++) {
      var pElem = paragraphElems[_i2];
      pElem.className = "jitter-dots";
    }
  }

  removeDots();
  createDots(document.querySelectorAll('.jitter-dots'));
};

pageElem.addEventListener('scroll', function (e) {
  var styleDisplay = e.target.scrollTop > 40 ? 'none' : 'block';
  activeLanguageElem.style.display = styleDisplay;
});
//# sourceMappingURL=main.js.map