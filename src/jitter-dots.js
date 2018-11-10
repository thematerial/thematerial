const jitterDotsRandNumber = (min, max) => {
  let num = Math.floor(Math.random() * max)+min
  return num <= min ? min : num
}
const jitterDotElems = document.querySelectorAll('.jitter-dots')
const createDots = (jdElems = jitterDotElems) => {
  for(let jdElem of jdElems) {
    for(let i = 0; i < jitterDotsRandNumber(3, 6); i++) {
      let dotElem = document.createElement('span')
      dotElem.className = 'dot'
      jdElem.appendChild(dotElem)
    }
  }
}

const removeDots = () =>  {
  const dotsInJitterDotsElem = document.querySelectorAll('.jitter-dots .dot')
  for(let dotElem of dotsInJitterDotsElem) {
    dotElem.remove()
  }
}

const spreadDots = (jdElems = jitterDotElems) => {
  for(let jdElem of jdElems) {
    let [maxTop, maxLeft] = [jdElem.clientHeight, jdElem.clientWidth]
    let dotElems = jdElem.querySelectorAll('.dot')
    for(let dotElem of dotElems) {
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
