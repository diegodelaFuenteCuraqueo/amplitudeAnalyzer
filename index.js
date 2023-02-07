const expressFileUpload = require('express-fileupload')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)

// routes
app.get('/', (req, res) => {
  //res.send('Hello World!')
  return res.sendFile(__dirname + '/views/index.html')
})


app.post('/analyze',  async (req, res) => {
  console.log('POST /analyze')
  //console.log("REQ", req)
  //console.log("RES", res)

  let file = req.files.file || {}
  console.log('file', file)

  //file.mv("tmp/" + file.name, (err) => {
  //  if (err) return res.sendStatus(500).send("ERROR", err)
  //  console.log("archivo subido correctamente")
  //})

  //await analyseMedia("tmp/" + file.name, req.body).then((_data) => {
  //  mediaData = _data
  //  console.log("DATA", mediaData)
  //  return
  //})
  //return "ok"

  return res.sendFile(__dirname + '/views/index.html')
})


// start
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("listening to port " + port)
})
