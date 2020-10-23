var mqtt = require('mqtt')
var moment = require('moment')
const { json } = require('body-parser')
const { decodeBase64 } = require('bcryptjs')
var db = require('../api/db');
var server = require("../const/constance");
const mainUtil = require("./main_controller");
const con = require('../api/db');


exports.solinoid_valve_on = (topic, status) => {
    var client = mqtt.connect(server.mqtt)
    client.on('connect', () => {
        console.log(topic, status);
        client.publish(topic, status)
        client.end()
    });

}

exports.solinoid_valve_auto = (action) => {
    var topic_SHT20 = 'outTopic'
    client.on('message', (topic_SHT20, el_message) => {
        var message = JSON.parse(el_message)

        if (action == "auto") {
            hum = message.humid
            humid = hum.toString()
            if (humid < "50") {
                client.publish("esp/test", "on")
                console.log("on")
                client.end()
            }
            if (n > "84") {
                client.publish("esp/test", "off")
                console.log("off")
                client.end()
            }
        }

        client.on('connect', () => {
            client.subscribe(topic_SHT20)
        })

    })
}

exports.pub_time = (time_arr, client_id) => {
    const mqtt = require('mqtt')
    const client = mqtt.connect(server.mqtt)
    const topic = client_id

    let time_test = moment().format('HH:mm')
    console.log(time_test);
    let data = []

    time_arr.map((e) => {
        let hour = moment(e.time).format('H')
        let min = moment(e.time).format('m')
        let sec = moment(e.time).format('s')

        hour = parseInt(hour);
        min = parseInt(min);
        sec = parseInt(sec);

        if (e.time < time_test) {
            // console.log("0")
            status = 0
        }
        else {
            // console.log("1")
            status = 1
        }

        data.push({
            hour: hour,
            min: min,
            sec: sec,
            action: e.action,
            status: status 
        });

        console.log(data)
    });
    
    let time_to_device = data
   

    client.on('connect', () => {
        client.publish(client_id, JSON.stringify(time_to_device))
        client.end()
    });

}

exports.send_time = () => {
    return ((req, res, next) => {
        // console.log("time : ",time)
        db.query(`SELECT device_critical FROM device_information WHERE client_id = '${req.params.id}'`, (err, result) => {
            if (err) throw err
            else {
                let data = []
                let hour = null
                let min = null
                let sec = null
                let status = null
                let time_array = null
                let time_test = moment().format('HH:mm')


                result.map((e) => {
                    time_array = JSON.parse(e.device_critical)

                })

                time_array.map((e_time) => {

                    let hour = moment(e_time.time).format('HH:mm:ss')

                    // console.log(moment(e_time.time).format('HH:mm'))
                    // console.log(time_test)
                    if (e_time.time < time_test) {
                        // console.log("0")
                        status = 0
                    }
                    else {
                        // console.log("1")
                        status = 1
                    }

                    h = moment(e_time.time).format('H');
                    m = moment(e_time.time).format('m');
                    s = moment(e_time.time).format('s');

                    hour = parseInt(h);
                    min = parseInt(m);
                    sec = parseInt(s);

                    data.push({
                        hour: hour,
                        min: min,
                        sec: sec,
                        action: e_time.action,
                        status: status
                    });

                    // console.log(data)
                })

                // let device_critical = null
                // if (result[0]) { //เช็คข้อมูล
                //     device_critical = JSON.parse(result[0].device_critical) //ทำให้เป็น json
                //     // console.log(device_critical)
                // }

                req.result = data

                next();
            }
        });

    });
}


exports.send_time_setup_to_db = () => {
    return ((req, res, next) => {

        db.query(` SELECT device_critical FROM device_information WHERE client_id = ?`, [req.body.client_id], (err, SelectTimeResult) => {
            if (err) throw err
            else {

                if (SelectTimeResult[0]) {
                    let time_arr = JSON.parse(SelectTimeResult[0].device_critical) || []
                    time_arr.push(...req.body.device_critical)

                    db.query(` UPDATE device_information SET device_critical = ? WHERE  client_id = ? `, [JSON.stringify(time_arr), req.body.client_id], (err, result) => {
                        if (err) throw err
                        else {
                            // solinoid.pub_time(data);
                            solinoid.pub_time(req.body.device_critical, req.body.client_id);
                            next();

                        }
                    });
                }
            }
        });
    });
}

exports.send_time_setup_to_app = () => {
    return ((req, res, next) => {

        db.query(`SELECT device_critical FROM device_information WHERE client_id = '${req.params.id}'`, (err, result) => {
            // console.log(result);
            if (err) throw err
            else {
                let time_array = []
                if (result[0]) {

                    time_array = JSON.parse(result[0].device_critical) || []
                    res.result = time_array;
                }

                next();
            }
        });

    });
}


