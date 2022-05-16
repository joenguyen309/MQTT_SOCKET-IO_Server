const express = require('express')
const mqtt = require('mqtt')
const app = express()
var bodyParser = require('body-parser');


app.use(express.static("./client"))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




var server = require("http").Server(app);

var io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});
var port = 8000

server.listen(port)

// define for flespi token
var broker_url = 'mqtt://mqtt.flespi.io:1883'
var option = {
        username: "FlespiToken K6o53UAhsIZfSEOTVuFzYqaXaseJYpayjntb7Tinq7q8A4QjmlIbBIYzZ17Ng59n",
        password: ""
    }
    // For MySql setup
var mysql = require('mysql')

var connect_mysql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydatabase'
})



var temp = 0.0
var hum = 0.0

// connect to flepi token
const client = mqtt.connect(broker_url, option)

// define topic
// const temperature_Topic = "esp/temp"
// const humidity_Topic = "esp/humidity"
// const motor_Topic = "esp/motor" 
const rawdata_Topic = "esp/rawdata"

client.on('connect', () => {
    console.log('Connected to MQTT broker')
        // connect to MySql
    connect_mysql.connect(function(err) {
        if (err) console.log("Fail connect to MySql")
        console.log("Connect to MySql in server")
    })

    // subscribe to topic
    client.subscribe([rawdata_Topic], () => {
        console.log(`Subscribe to topic '${rawdata_Topic}'`)
    })
})

/////// server connect
io.on('connect', function(socket) {
    socket.on('publish', function(data) {
        client.publish(data.topic, data.payload);
        console.log('Publish to ' + data.payload);
    })
})

io.on('disconnect', function(socket) {

})


client.on('message', (topic, payload) => {
    var get_payload = payload.toString()
    console.log('Received Message:', topic, get_payload)
    console.log("------------------")
    temp = parseFloat(get_payload.split("&")[0]);
    hum = parseFloat(get_payload.split("&")[1]);
    let infor = { Temp_data: temp, Hum_data: hum }
    let sql = "INSERT INTO infor SET ?"
    let query = connect_mysql.query(sql, infor, (err, result) => {
        if (err) { throw err }
        // console.log(result)
    })

    io.emit('send_server', get_payload)
})

// for show data
app.get("/home", function(req, res) {
    res.sendFile(__dirname + '/client.html');
});
//// action for login page
app.get("/login", function(req, res) {
    res.sendFile(__dirname + '/login.html');
});
app.post("/login", function(req, res) {
    var emailAddress = req.body.email_address;
    var password = req.body.password;
    var sql = 'SELECT * FROM registration WHERE email_address =? AND password =?';
    let query = connect_mysql.query(sql, [emailAddress, password], (err, data) => {
        if (err) {
            console.log(err)
            throw err
        }
        if (data.length > 0) {
            res.redirect('/home');
        } else {
            res.sendFile(__dirname + '/login.html');
            console.log("Your Email Address or password is wrong")
            console.log(emailAddress)
            console.log(password)
        }
    })
})

//// action for register page
app.get("/register", function(req, res) {
    res.sendFile(__dirname + '/temp_register.html')
})

app.post("/register", function(req, res, next) {
    inputData = {
        username: req.body.username,
        email_address: req.body.email_address,
        password: req.body.password,
        password_cofirm: req.body.password_confirm
    }
    console.log(inputData)

    var sql = 'SELECT * FROM registration WHERE email_address =?'
    let query = connect_mysql.query(sql, [inputData.email_address], (err, data) => {
        if (err) { throw err }
        if (data.length > 1) {
            var msg = inputData.email_address + "was already exist"
        } else if (inputData.password_cofirm != inputData.password) {
            var msg = "Password & Confirm Password is not Matched"
            console.log(inputData.password_cofirm)
            console.log(inputData.password)
        } else {
            // save users data into database
            inputDB = {
                username: inputData.username,
                email_address: inputData.email_address,
                password: inputData.password
            }
            var sql = 'INSERT INTO registration SET ?'
            let query = connect_mysql.query(sql, inputDB, (err, data) => {
                if (err) throw err
            });
            var msg = "Your are successfully registered"
        }
        console.log(msg)
    })
    res.sendFile(__dirname + '/temp_register.html')
})

// acction for logout pag