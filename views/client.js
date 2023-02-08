const inputBtn = document.getElementsByName("file")[0]
const submit = document.getElementById("submit")
const video = document.getElementById("video")

inputBtn.addEventListener("change", (event) => {
  console.log("inputBtn changed", event)
  const file = inputBtn.files[0];
  window.mediaUrl = URL.createObjectURL(file);
  console.log("file", file)

  video.src = window.mediaUrl || ""
  // Save data to localStorage
  localStorage.setItem("mediaUrl", window.mediaUrl);
})

window.onload = () => {
  console.log("setting video sr c", localStorage.getItem("mediaUrl") || "")
  video.src = localStorage.getItem("mediaUrl") || ""
}

fetch("/data")
  .then((response) => response.json())
  .then((data) => {
    window.analysis = data
    document.getElementById("dynamicRange").innerHTML = data.dynamicRange
    document.getElementById("maxRMS").innerHTML = data.maxRMS
    document.getElementById("minRMS").innerHTML = data.minRMS

    if(data.frames) {
      window.ampArray = data.frames.map((frame) => {
        return {
          RMS: frame.RMS,
          time: frame.time
        }
      })
    }
  })

  video.addEventListener("timeupdate",
    (event) => {
      if (!window.ampArray) return
      window.currentTime = event.srcElement.currentTime
      amplitudeFrame = window.ampArray.find((amp) => {
        if(amp.time > window.currentTime && amp.time < window.currentTime + 0.5) {
          return true
        } else {
          return false
        }
      })

      if (amplitudeFrame.RMS < -45) {
        document.getElementById("minRMS").style.backgroundColor = "red"
      } else {
        document.getElementById("minRMS").style.backgroundColor = "white"
      }
    }
  )
