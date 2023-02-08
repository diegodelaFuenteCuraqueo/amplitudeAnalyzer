const expressFileUpload = require('express-fileupload')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { getAmplitudeArray } = require('./api/AmplitudeAnalysis')
const fs = require('fs')
const path = require('path')

let mediaData = {}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)
app.use(express.static(path.join(__dirname + '/views')));


// routes
app.get('/', (req, res) => {
  mediaData = {}
  return res.sendFile(__dirname + '/views/index.html')
})

// this route is used to upload a media and receive an analysis object
app.post('/analyze', async (req, res) => {
  console.log("/analyze", req, res)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  let file = req.files.file || {}
  console.log('file', file)

  file.mv("tmp/" + file.name, (err) => {
    if (err) return res.sendStatus(500).send("ERROR", err)
    console.log("archivo subido correctamente")
  })

  await getAmplitudeArray("tmp/" + file.name)
  .then((_data) => {
    mediaData = {}
    mediaData = _data
    console.log("DATA", mediaData)
    fs.unlink("tmp/" + file.name, (err) => {
      console.log("deleting file...")
      if (err) {
        return res.status(500).send({ message: "Error deleting file" });
      }
    })
    return res.sendFile(__dirname + '/views/index.html')
  })
  return res.sendFile(__dirname + '/views/index.html')
})

app.get('/data', (req, res) => {
  if(JSON.stringify(mediaData) === '{}') return res.status(404).send({ message: "No data found" })
  return res.json(mediaData)
})

// start
const port = process.env.PORT || 9090
app.listen(port, () => {
  console.log("listening to port " + port)
})
