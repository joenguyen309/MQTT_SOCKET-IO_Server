var temp = 0.0
var hub = 0.0

$(document).ready(function () {
    var socket = io();

    socket.on('send_server', function (data) {

        temp = parseFloat(data.split("&")[0]);
        hub = parseFloat(data.split("&")[1]);
        
        console.log("Temp: %s",temp)
        console.log("------------------")
        console.log("Humidity: %s",hub)
        console.log("------------------")
    })

    $('#button').ready(function () {
        socket.on('connect', function () {
            $("#on").click('click', function () {
                socket.emit('publish', {topic: 'esp/motor', payload: '1'})
                console.log("on");
            })

            $("#off").click('click', function () {
                socket.emit('publish', {topic: 'esp/motor', payload: '0'})
                console.log("off");
            })

            $("#reverse").click('click', function () {
                socket.emit('publish', {topic: 'esp/motor', payload: '2'})
                console.log("reverse");
            })

            socket.on('mqtt', function (msg) {
                console.log(msg.topic, msg.payload);
            })
        })
    })
});