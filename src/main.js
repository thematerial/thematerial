const isMobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)

const bodyElem = document.querySelector('body')
const pageElem = bodyElem.querySelector('#page')
const videoElem = document.querySelector('#video-intro')
const videoPlayer = videoElem.querySelector('#video-player')

const swapScene = ({timer, scene} = {}, callbackFn) => new Promise((resolve) => setTimeout(() => {
    if(scene) bodyElem.className = scene
    if(typeof callbackFn === 'function') callbackFn()
    resolve()
  }, timer || 0)
)

const videoTimeUpdate = () => {
  swapScene({timer: 0, scene: 'display-video-intro'})
  videoPlayer.removeEventListener('timeupdate', videoTimeUpdate, false)
}
videoPlayer.addEventListener('timeupdate', videoTimeUpdate)
videoPlayer.addEventListener('ended', () => videoIntroEnd())

const videoIntroEnd = () => (
  swapScene({timer: 0, scene: 'display-video-intro display-skip-video-intro display-acquisition'})
  .then(() => swapScene({timer: 2500}, () => videoElem.remove()))
  .then(() => swapScene({timer: 4000, scene: 'display-page'}))
)

// videoIntroEnd() // <-- remove for video play at start

const sequenceElem = document.querySelector('#sequence')
const startSequence = () => {
  const timer = 3000
  goInFullscreen(bodyElem)
  diasTheEnd(false)
  swapScene({timer: 0, scene: 'display-sequence-intro pt1'})
  .then(() => swapScene({timer, scene: 'display-sequence-intro pt2'}))
  .then(() => swapScene({timer, scene: 'display-sequence-intro pt2 display-dias'}, () => changeImage(0, 0)))
}

const goInFullscreen = (element) => {
	if(element.requestFullscreen) element.requestFullscreen()
	else if(element.mozRequestFullScreen) element.mozRequestFullScreen()
	else if(element.webkitRequestFullscreen) element.webkitRequestFullscreen()
	else if(element.msRequestFullscreen) element.msRequestFullscreen()
}
const goOutFullscreen = (element) => {
	if(document.exitFullscreen) document.exitFullscreen()
	else if(document.mozCancelFullScreen) document.mozCancelFullScreen()
	else if(document.webkitExitFullscreen) document.webkitExitFullscreen()
	else if(document.msExitFullscreen) document.msExitFullscreen()
}

/**
 * DIAS 
*/
const dias = {currIdx: 0}
const diasElem = document.querySelector('#dias')
const diasBarInnerElems = document.querySelectorAll('#dias .bar-inner')
const btnImagePrevNextElem = document.querySelector('#btn-image-prev-next')
const imageElems = diasElem.querySelector('#image-provider').querySelectorAll('img')
const imageSrcEle = diasElem.querySelector('#image-src #image-content')
const imageMainEle = diasElem.querySelector('#image-main')
const imageOptionElem = diasElem.querySelector('.image-option')
const imageTitleTxtElem = diasElem.querySelector('h1.image-title') 
const imageDimensionsTxtElem = diasElem.querySelector('p.image-details .image-dimensions')
const imageMaterialTxtElem = diasElem.querySelector('p.image-details .image-material')
const imageZoomLevelElem = diasElem.querySelector('#image-zoom-level')

const pzArea = document.querySelector('#image-src')

const pz = panzoom(
  pzArea, {
    maxZoom: 3.33, 
    minZoom: 1, 
    zoomSpeed: isMobile ? 0.077 : 0.02, 
    smoothScroll: false, 
    onTouch: () => {
      return false

    }
  }
)

const imageSrcList = Array.from(imageElems).map(img => Object.assign(
  {
    ...img.dataset,
    src: img.src,
    title: img.title,
  }
))

let removeBarInnerActiveTimer
let isMouseDown = false
const changeImage = (dest, currIdx = dias.currIdx) => {
  changeZoomLevel(0)
  const nextIdx = currIdx + dest
  btnImagePrevNextElem.querySelector('.btn-prev').disabled = nextIdx <= 0
  clearTimeout(removeBarInnerActiveTimer)
  showGUI(false, 3300)
  if(nextIdx < 0) return
  else if(nextIdx > imageSrcList.length - 1) {
    dias.currIdx = dias.currIdx >= imageSrcList.length ? dias.currIdx : nextIdx /* 
      treat "the end" as if was part of image sequence, so add to the dias current idx.
      when try to skip to next image deny when, reached the end
    */
    return diasTheEnd(true)
  }
  diasTheEnd(false)
  const img = imageSrcList[nextIdx]
  dias.currIdx = nextIdx
  imageSrcEle.style.backgroundImage = `url(${img.src})`
  imageTitleTxtElem.innerText = img.title
  imageDimensionsTxtElem.innerText = img.dimensions
  imageMaterialTxtElem.innerText = img.material
  pz.moveTo(0,0)
  setTimeout(() => pzArea.focus(), 2200)
}

const diasTheEnd = (isEnd) => {
  if(isEnd) {
    diasElem.className = 'display-dias-the-end'
    btnImagePrevNextElem.querySelector('.btn-next').disabled = true
  }
  else {
    diasElem.className = ''
    btnImagePrevNextElem.querySelector('.btn-next').disabled = false
  }
}

let guiIsShowing = false
const showGUI = (event, removeTimer) => {
  clearTimeout(removeBarInnerActiveTimer)
  const isImageContent = event && event.target.id === 'image-content'
  if(isMouseDown == false) {
    for(let ele of diasBarInnerElems) ele.className = 'bar-inner active'
    btnImagePrevNextElem.style.display = 'block'
    guiIsShowing = true
  }
  removeBarInnerActiveTimer = setTimeout( () => {
    if(isMobile || isImageContent) {
      hideGUI()
    }
  }, removeTimer || 720)
}

const hideGUI = () => {
  for(let ele of diasBarInnerElems) ele.className = 'bar-inner'
  btnImagePrevNextElem.style.display = 'none'
  guiIsShowing = false
}

const diasClose = () => {
  goOutFullscreen(bodyElem)
  swapScene({timer: 0, scene: 'display-page'})
}

if(!isMobile) {
  diasElem.addEventListener('keydown', (e) => {
    if(e.code == 'Digit0' || e.code == 'Escape') {
      changeZoomLevel(0)
      pz.moveTo(0,0)
    }
    if(e.code == 'Space') {
      // Bring to center ?
    }
  })
  diasElem.addEventListener('keyup', (e) => {
    const scale = pz.getTransform().scale
    if(scale > 1) return
    if(e.code == 'ArrowLeft') changeImage(-1)
    if(e.code == 'ArrowRight') changeImage(+1)
  })
  diasElem.addEventListener('mousemove', (event) => {
    showGUI(event)
  })
  diasElem.addEventListener('mousedown', (event) => {
    isMouseDown = true
    const isImageContent = event.target.id === 'image-content'
    if(isImageContent) hideGUI(event)
  })
  diasElem.addEventListener('mouseup', (event) => {
    isMouseDown = false
    const scale = pz.getTransform().scale
    imageZoomLevelElem.value = scale
  })
  diasElem.addEventListener('mousewheel', (event) => {
    const scale = pz.getTransform().scale
    imageZoomLevelElem.value = scale
  })
}
else {
  let touchShowGUITimer
  let longTouchTimer
  let isLongTouch = false
  diasElem.addEventListener('panstart', () => {
    clearTimeout(touchShowGUITimer)
    hideGUI() // hide gui when moving picture
  })
  diasElem.addEventListener('touchstart', (e) => {
    clearTimeout(longTouchTimer)
    clearTimeout(touchShowGUITimer)
    isLongTouch = false
    if(e.target.type === 'button') return // when target is button skip further logic
    if(guiIsShowing) {
      clearTimeout(removeBarInnerActiveTimer)
      hideGUI()
    }
    else {
      longTouchTimer = setTimeout(() => isLongTouch = true, 325)
      touchShowGUITimer = setTimeout(() => {
        if(isLongTouch === false) showGUI(false, 3300)
      }, 330)
    }
  })
  diasElem.addEventListener('touchend', (e) => {
    clearTimeout(longTouchTimer)
    if(isLongTouch) {
      clearTimeout(touchShowGUITimer)
    }
  })
}

setInterval( () => { // workaround to deny pan/move when image is not zoomed
  const scale = pz.getTransform().scale
  imageZoomLevelElem.value = scale
  if(scale == 1) pz.moveTo(0,0)
}, 2)

let changeZoomFocusTimer
const changeZoomLevel = (zoomValue) => {
  clearTimeout(changeZoomFocusTimer)
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  pz.zoomAbs(windowWidth / 2, windowHeight / 2, zoomValue)
  if(zoomValue == 1) pz.moveTo(0, 0) // center
  changeZoomFocusTimer = setTimeout( () => pzArea.focus(), 720)
}

const isExhibition = window.location.search.includes('exhibition')
if(isExhibition) {
  imageOptionElem.remove()
  videoIntroEnd(true)
  startSequence()
}

const languageTextElems = document.querySelectorAll('[data-da]')
for(let langTextElem of languageTextElems) { // must run before jitter create dots, or it will produce 'dot elements' in dataset.en
  langTextElem.dataset.en = langTextElem.innerHTML
}

const activeLanguageElem = document.querySelector('.active-language')
const setLanguage = (lang) => {
  for(let langTextElem of languageTextElems) {
    activeLanguageElem.className = 'active-language '+lang
    langTextElem.innerHTML = langTextElem.dataset[lang]
    for(let p of langTextElem.querySelectorAll('p')){
      p.className="jitter-dots"
    }
  }
  removeDots()
  createDots(document.querySelectorAll('.jitter-dots'))
}

pageElem.addEventListener('scroll', (e) => {
  let styleDisplay =  e.target.scrollTop > 40 ? 'none' : 'block'
  activeLanguageElem.style.display = styleDisplay
})

const noDownloadYetPrompt = () => alert(
  'Download is not possible until the full release of Facts & Possibilities, January 1, 2019'
)