const ffmpeg = require('fluent-ffmpeg')

function getAmplitudeArray(inputFile) {
  return new Promise((resolve, reject) => {
    const ampData = []
    let frameData = {}

    const cmd = new ffmpeg(inputFile)
    .addOption('-af', 'astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level')
    .addOption('-f', 'null')
    .output('/dev/null')
    .on("start", commandLine => console.log("Ffmpeg command: " + commandLine))
    .on("error", err => reject(err))
    .on("stderr", stderrLine => {
      if(stderrLine.includes("frame:")) {
        frameData = {}
        frameData.frame= parseInt((stderrLine.split("frame:")[1]).split(" ")[0])
        frameData.time = parseFloat(stderrLine.split("pts_time:")[1])
      } else if (stderrLine.includes("lavfi.astats.Overall.RMS_level")) {
        frameData.RMS = parseFloat(stderrLine.split("lavfi.astats.Overall.RMS_level=")[1])
        ampData.push(frameData)
      }
    })
    .on("end", function() {
      console.log("Processing finished !")

      const minValue = ampData.reduce((min, item) => {
        return item.RMS < min ? item.RMS : min
      }, 0)

      const maxValue = ampData.reduce((max, obj) => {
        return obj.RMS > max ? obj.RMS : max;
      }, ampData[0].RMS);

      ampData.minRMS = minValue
      ampData.maxRMS = maxValue
      ampData.dynamicRange = Math.abs(maxValue - minValue)
      resolve(ampData)
    })
    .run();
  })
}

getAmplitudeArray("../dance.mp4")
  .then((data) => {
    console.log("DATA", data)
})

module.exports = { getAmplitudeArray }