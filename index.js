const expressFileUpload = require('express-fileupload')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { getAmplitudeArray } = require('./api/AmplitudeAnalysis')
const fs = require('fs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)

// routes
app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/views/index.html')
})

let mediaData = {}

app.post('/analyze', /* upload.single("file"), */ async (req, res) => {
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

// start
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("listening to port " + port)
})
