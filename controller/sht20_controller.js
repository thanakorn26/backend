var db = require('../api/db');
var bodyParser = require('body-parser');
var mqtt = require('mqtt');
var io = require('socket.io-client');
var moment = require('moment');
var datetime = moment().utc(+7).format('DD/MM/YYY HH:mm:ss');
var bodyParser = require('body-parser');
var server = require("../const/constance");
var cron = require('node-cron')
const { Double } = require('bson');
// console.log(typeof datetime);

exports.sht20_send_db = () => {
    return ((req, res, next) => {
        let data = [
            null,
            req.body.client_id,
            req.body.device_type,
            req.body.device_activity,
            req.body.device_critical
        ]
        db.query(`INSERT INTO (users_id,client_id,device_type,device_activity,device_critical) VALUES (?)`, [data], (err, result) => {
            if (err) throw err
        });
    });
}

send_to_app = (message) => {

    let json_data = null

    try {
        json_data = message
    } catch (err) {
        json_data = { humid: '00', temp: '00' }
    }
    let payload = {
        name: 'aom',
        msg: json_data
    }

    // socket.emit('data_tranfer', payload, () => {
    //     socket.close()
    // })

    try {
        var socket = io(server.socket)
        socket.emit('data_tranfer', payload)

    } catch (err) {
        console.log('', err)
    }
}

// update_sht20 = (message) => {
//     // console.log(message);

//     let device = message.device
//     let temp = message.temp
//     let humid = message.humid

//     db.query(`UPDATE temp_humid_data SET temp ='${temp}',humid ='${humid}' 
//         WHERE device_type ='${device}'`, (err, result) => {
//         if (err) throw err
//         else {
//             console.log(result);
//         }

//     });

// }

exports.send_temp_humid_to_db = () => {
    return ((req, res, next) => {

        db.query(`SELECT * FROM temp_humid_data WHERE client_id = '${req.params.id}'`, (err, result) => {
            if (err) throw err
            else {
                if (result[0]) {
                    let device = result[0].client_id
                    let temp = result[0].temp //string
                    let humid = result[0].humid //number

                    db.query(`UPDATE sht20_information SET temp = '${temp}',humid = '${humid}' WHERE device_name = '${device}'`, (err, result) => {
                        if (err) throw err;
                        else {
                            res.result = result;
                        }
                    });
                }
            }
        });

    });
}

exports.sub_sht20 = () => {
    var mqtt = require("mqtt")
    var client = mqtt.connect(server.mqtt)
    var topic = 'data_sht20'

    client.on('message', (topic, el_message) => {
        message = el_message.toString();
        message_json = JSON.parse(el_message)
        // console.log(message_json);
        // send_to_app(message_json);
        // update_sht20(message_json);
    });
    client.on('connect', () => {
        client.subscribe(topic)
    });
}




