

const mqtt = require('mqtt')

// const mysql = require('mysql')

const express = require('express')

const app = express()

app.use(express.static("./client"))
app.set("view engine", "ejs");

var server = require("http").Server(app);
var io = require("socket.io")(server,{
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});
var port = 8000
const IP = 'localhost'

server.listen(port)

// define for flespi token
var broker_url = 'mqtt://mqtt.flespi.io:1883'
var option = {
    username: "FlespiToken K6o53UAhsIZfSEOTVuFzYqaXaseJYpayjntb7Tinq7q8A4QjmlIbBIYzZ17Ng59n",
    password: ""
}

// connect to flepi token
const client = mqtt.connect(broker_url,option)

// define topic
// const temperature_Topic = "esp/temp"
// const humidity_Topic = "esp/humidity"
const motor_Topic = "esp/motor"
const rawdata_Topic = "esp/rawdata"
var get_Temperature 
var get_Humidity

    client.on('connect', () => {
        console.log('Connected to MQTT broker')
    // subscribe to topic

        client.subscribe([rawdata_Topic], () => {
            console.log(`Subscribe to topic '${rawdata_Topic}'`)
        })
    })

    app.get("/", function (req, res) {
        res.sendFile(__dirname +'/index.html');
        // res.render('index.ejs');
    });

    // io.on('connect', function(socket) {
    //     socket.on('publish', function (data) {
    //         client.publish(data.topic, data.payload);
    //         console.log('Publish to '+ data.payload);
    //     });
    // })


    client.on('message', (topic, payload) => {
        var get_payload = payload.toString()
    
        // get_Temperature = get_payload.split("&")[0]
        // get_Humidity = get_payload.split("&")[1]
        console.log('Received Message:', topic, get_payload)
        console.log("------------------")
        // console.log("Temp: %s",get_Temperature)
        // console.log("------------------")
        // console.log("Humidity: %s",get_Humidity)
        // console.log("------------------")

        io.on('connect', function(socket) {
            socket.emit('send_server', get_payload )
            socket.on('publish', function (data) {
                client.publish(data.topic, data.payload);
                console.log('Publish to '+ data.payload);
            })
        })
    })


