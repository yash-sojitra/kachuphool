const express = require("express")
const https = require("https")
const fs = require("fs")
const app = express()
const bodyParser = require("body-parser")
const WebSocket = require("ws")
const mongoose = require("mongoose")
require('dotenv').config()
const url = require("url")
const redisClient = require("./redis/redisClient")

//middleware
const { pathLogger } = require("./middleware/pathLogger")

//routes
const userRoutes = require("./routes/user")
const {websocketRoutes} = require("./routes/websocket")

//middleware usage
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(express.json())
app.use(pathLogger)

app.use("/api/v1/user",userRoutes)

const serverOptions = {
    cert: fs.readFileSync('server.cert'),
    key: fs.readFileSync('server.key')
  };

const server = https.createServer(serverOptions, app)
const webSocketServer = new WebSocket.Server({ server })

app.get("/", (req, res) => {
    res.send("hello world")
})

webSocketServer.on('connection', (ws, request)=>{

    const path = url.parse(request.url).pathname;

    console.log(path);
    

    websocketRoutes(ws)

    // ws.on('message', (message) => {

    //     // const data = JSON.parse(message)

    //     console.log("recieved %s",message);

    //     let JSONdata = JSON.parse(message);
    //     console.log(JSONdata)
        
    //     ws.send(message)

    //     // if(data.type == 'joinroom'){}

    // })

    ws.on('close',()=>{
        console.log("client disconnected");
    })
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to mongodb");
        
        server.listen(process.env.PORT, () => {
            console.log(`server started at port ${process.env.PORT}`)
        })
    })
    .catch(err => console.log(err))