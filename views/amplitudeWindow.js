
/**
 * Draws amplitude data timeline on the canvas
 */

new p5(function (p) {
  p.setup = function () {
    p.createCanvas(700, 100)
  }

  // draws on every frame
  p.draw = function () {
    p.background(0,0,0)
    if(!window.ampArray || !window.currentTime) return

    for(let i = 0; i < window.ampArray.length; i++) {
      const amp = window.ampArray[i].RMS
      const time = window.ampArray[i].time
      p.strokeWeight(1)

      p.fill(255)
      p.stroke(0,255,0)
      const mappedTime = p.map(time, 0, window.ampArray[window.ampArray.length-1].time, 0, 700)
      const mappedAmp = p.map(amp, window.analysis.minRMS, window.analysis.maxRMS, 0, 100)
      p.line(mappedTime, 100, mappedTime, mappedAmp)

      try {
        const mappedCursor = p.map(window.currentTime, 0, window.ampArray[window.ampArray.length-1].time, 0, 700)
        p.stroke(255,0,0,1)
        p.strokeWeight(5)
        p.line(mappedCursor, 0, mappedCursor, 100)
      } catch (error) {
        console.log("error", error)
      }
    }
  };
}, "canvas");