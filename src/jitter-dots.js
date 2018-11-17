const jitterDotsRandNumber = (min, max) => {
  let num = Math.floor(Math.random() * max)+min
  return num <= min ? min : num
}
const jitterDotElems = document.querySelectorAll('.jitter-dots')
const createDots = (jdElems = jitterDotElems) => {
  for(let i = 0; i < jdElems.length; i++) {
    let jdElem = jdElems[i]
    for(let r = 0; r < jitterDotsRandNumber(3, 6); r++) {
      let dotElem = document.createElement('span')
      dotElem.className = 'dot'
      jdElem.appendChild(dotElem)
    }
  }
}

const removeDots = () =>  {
  const dotsInJitterDotsElem = document.querySelectorAll('.jitter-dots .dot')
  for(let i = 0; i < dotsInJitterDotsElem.length; i++) {
    let dotElem = dotsInJitterDotsElem[i]
    dotElem.remove()
  }
}

const spreadDots = (jdElems = jitterDotElems) => {
  for(let i = 0; i < jdElems.length; i++) {
    let jdElem = jdElems[i]
    let [maxTop, maxLeft] = [jdElem.clientHeight, jdElem.clientWidth]
    let dotElems = jdElem.querySelectorAll('.dot')
    for(let i = 0; i < dotElems.length; i++) {
      let dotElem = dotElems[i]
      if(jitterDotsRandNumber(0, 3) > 0) { // only move sometimes
        dotElem.style.top = jitterDotsRandNumber(0, maxTop)+'px'
        dotElem.style.left = jitterDotsRandNumber(0, maxLeft)+'px'
        dotElem.style.padding = jitterDotsRandNumber(1, 3)+'px' // dot size
      }
    }
  }
}

createDots()

setInterval(() => spreadDots(document.querySelectorAll('.jitter-dots')), 2000) // query dots on now to get exacts size if changed since then
