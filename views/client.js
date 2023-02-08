const inputBtn = document.getElementsByName("file")[0]
const submit = document.getElementById("submit")
const video = document.getElementById("video")
let uploaded = false

inputBtn.addEventListener("change", (event) => {
  event.preventDefault();
  console.log("inputBtn changed", event)
  const file = inputBtn.files[0];
  console.log("file", file)
  //window.analysis = {}
  

  try {
    video.src = URL.createObjectURL(file)
    console.log("SUBMITING")
    const formData = new FormData(form)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/analyze', true)
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        //console.log("response", xhr.responseText)
      }
    }
    xhr.send(formData)

    requestAnalysisData()
  } catch (error) {
    console.log("error", error)
  }
})

const requestAnalysisData = () => {
  const fetchAmp = setInterval(async () => {
    await fetch("/data")
      .then((response) => response.json())
      .then((data) => {
        window.analysis = {}
        window.analysis = data
        document.getElementById("dynamicRange").innerHTML = data.dynamicRange
        document.getElementById("maxRMS").innerHTML = data.maxRMS
        document.getElementById("minRMS").innerHTML = data.minRMS
        if(data.frames) {
          window.ampArray = []
          window.ampArray = data.frames.map((frame) => {
            return {
              RMS: frame.RMS,
              time: frame.time
            }
          })
        }
      })
      .catch((error) => {
        console.log("f error", error)
      })
    }, 2000)
}


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
