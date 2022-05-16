$(function() {
    const socket = io()
    var label = [];
    var datasetHumi = [];
    var datasetTemp = [];

    const data = {
        labels: label,
        datasets: [{
                label: "Humi",
                backgroundColor: "blue",
                borderColor: "blue",
                data: datasetHumi,
                yAxisID: 'y',
            },
            {
                label: "Temp",
                backgroundColor: "red",
                borderColor: "red",
                data: datasetTemp,
                yAxisID: 'y1',
            },
        ],
    };

    // <block:config:0>

    const config = {
        type: "line",
        data,
        options: {
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',

                    // grid line settings
                    grid: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                },
            },
        },
    };


    var myChart = new Chart($("#myChart"), config);


    var time = new Date
    label.unshift(FormatDate(time)) // add "time" after connect 
    var count = 0


    function FormatDate() {
        var date = new Date;

        return [date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(), date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()]
    }
    // label.unshift(FormatDate(time))


    socket.on("send_server", (data) => {
        temp = parseFloat(data.split("&")[0]);
        hub = parseFloat(data.split("&")[1]);
        // console.log(time)
        // time.setSeconds(time.getSeconds() +10) 
        Update(FormatDate(), hub, temp, count)
        count = count + 1
    })

    $('#button').ready(function() {
        socket.on('connect', function() {
            $("#on").click('click', function() {
                socket.emit('publish', { topic: 'esp/motor', payload: '1' })
                console.log("on");
            })

            $("#off").click('click', function() {
                socket.emit('publish', { topic: 'esp/motor', payload: '0' })
                console.log("off");
            })

            $("#reverse").click('click', function() {
                socket.emit('publish', { topic: 'esp/motor', payload: '2' })
                console.log("reverse");
            })
        })
    })


    function Update(newLabel, newHumi, newTemp, newCount) {
        if (newCount < 10) {
            label.push(FormatDate(newLabel))
            datasetHumi.push(newHumi)
            datasetTemp.push(newTemp)
            myChart.update()
        } else {
            label.shift()
            label.push(FormatDate(newLabel))

            datasetHumi.shift()
            datasetHumi.push(newHumi)
            datasetTemp.shift()
            datasetTemp.push(newTemp)

            myChart.update()
        }
    }
})