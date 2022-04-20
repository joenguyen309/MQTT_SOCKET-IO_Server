$(function () {
    const socket = io()
    var label = [];


    var datasetHumi = [];
    var datasetTemp = [];

    const data = {
        labels: label,
        datasets: [
          {
            label: "Humi",
            backgroundColor: "blue",
            borderColor: "blue",
            data: datasetHumi,
          },
          {
            label: "Temp",
            backgroundColor: "red",
            borderColor: "red",
            data: datasetTemp,
          },
        ],
    };
    const data_temp = {
    labels: label,
    datasets: [
        {
        label: "Temp",
        backgroundColor: "red",
        borderColor: "red",
        data: datasetTemp,
        }
    ],
    };

    const data_hum = {
        labels: label,
        datasets: [
            {
            label: "Humi",
            backgroundColor: "blue",
            borderColor: "blue",
            data: datasetHumi,
            }
        ],
        };


    // <block:config:0>

    const config = {
        type: "line",
        data,
        options: {},
        };
        
    const config_temp = {
        type: "line",
        data_temp,
        options: {},
    };

    const config_hum = {
        type: "line",
        data_hum,
        options: {},
    };

    var myChart = new Chart($("#myChart"), config);

    // var myChart_temp = new Chart($("#myChart_temp"), config_temp);
    var myChart_hum =  new Chart($("#myChart_hum"),  config_hum);

    var time = new Date

    var count = 0


    function FormatDate(time) {

    var date = new Date(time);

    return [date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(), date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()]

    }

    label.unshift(FormatDate(time))

    // socket.on("firstConnect", (data) => {
    //   data.forEach(element => { //10 9 8 7 6 =>  7 8 9 10 11
    //     label.unshift(FormatDate(element.time));
    //     datasetHumi.unshift(element.humi);
    //     datasetTemp.unshift(element.temp);
    //   });
    //   console.log(label)
    //   myChart.update()
    // })

    socket.on("send_server", (data) => {
        temp = parseFloat(data.split("&")[0]);
        hub = parseFloat(data.split("&")[1]);
        // console.log(time)
        Update(time, hub, temp,count)
        count = count+1
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

    
    function Update(newLabel, newHumi, newTemp,newCount) {
        if (newCount <10) {
            label.push(FormatDate(newLabel))
            datasetHumi.push(newHumi)
            datasetTemp.push(newTemp)
            // myChart_temp.update()
            myChart_hum.update()
            myChart.update()
        }
        else {
            label.shift()
            label.push(FormatDate(newLabel))


            datasetHumi.shift()
            datasetHumi.push(newHumi)
            datasetTemp.shift()
            datasetTemp.push(newTemp)

            // myChart_temp.update()
            myChart_hum.update()
            myChart.update()
        }
    }
})
