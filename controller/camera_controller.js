var mqtt = require('mqtt')
var io = require('socket.io-client')
var fs = require('fs')
var moment = require("moment")
moment.locale('th')
var server = require("../const/constance");
var db = require('../api/db');
const { get } = require('http')
const e = require('express')
const router = require('../route/camera')




sendimage_app = (client_id) => {

  db.query(`SELECT image_path FROM image  WHERE client_id = '${client_id}' ORDER BY image_id DESC LIMIT 1 `, (err, result) => {
    if (err) throw err
    else {
      var socket = io(server.socket)
      let path = result[0]
      // console.log(result[0]);
      // if (result[0]) { //เช็คข้อมูล
      //   path = JSON.parse(result[0].path_image) //ทำให้เป็น json
      //   console.log(result[0].path_image)
      // }

      // console.log(path);
      let payload = {
        name: "camera_snapshot",
        msg: path
      }
      // "http://127.0.0.1/api/v1/camera/image/snapshot_16_59_51.png"
      // "http://192.168.1.96/main/image/out.png?id="+new Date().getTime()

      socket.emit('data_tranfer', payload)
      console.log(payload);
    }
  });

}

get_date = () => {
  return Date.now()
}


exports.sub_img = (devices) => {
  var mqtt = require('mqtt');
  var client = mqtt.connect(server.mqtt);
  var topic = devices + '/snapshot'

  client.on('message', (topic, el_message) => {
    message = el_message.toString()
    // console.log("topic",topic)  
    // console.log("message",message)

    let split_topic = topic.split("/")
    console.log("str_split", split_topic)


    if (split_topic[2] == 'snapshot') {
      var mm = moment().format("HH_mm_ss DD_MM_YYYY ");
      var datetime = moment().utc(+7).format('DD/MM/YYY HH:mm:ss');
      // console.log("Sub_imag");
      const time_img = "snapshot_" + mm + ".png"
      console.log(time_img);

      fs.writeFile(`./image/camera/${time_img}`, el_message, 'base64', function (err) {
        console.log(err);

        sendimage_app(split_topic[1]);

        let path = "camera/api/v1/image/camera/" + time_img
        // let path = "main/image/camera/" + time_img
        let gallery_id  = 1

        let data = [
          null,
          split_topic[1],
          path,
          gallery_id,
          null
        ]
        // main/camera/image/snapshot_16_59_51.png เก็บเข้า db ให้appใช้
        db.query(`INSERT INTO image (image_id,client_id,image_path,gallery_id,detection_st) VALUES (?)`, [data], (err, result) => {
          if (err) throw err
          else {
            // delete_image ();
            console.log("Success")
          }
        });
      });

    }
  });

  client.on('connect', () => {
    client.subscribe(topic)
  });

  client.on('message', (topic, el_message) => {
    message = el_message.toString()

    if (topic == 'TEST/MQTT') {
      console.log(message)
    }
  });

  client.on('connect', () => {
    client.subscribe(topic)
  });
}

// delete_image = () => {          //ลบรูป

//   const datetime = moment().utc(+7).format('DD/MM/YYY HH:mm:ss');

//   db.query('SELECT datetime,path_image FROM image_information', (err, result) => {

//     let time = result.datetime;
//     let path = result.path_image;
//     let split_path = path.split("/")
//     console.log("str_split", split_path)

//     if (time<datetime) {
//       fs.unlink('./image/camera/'+split_path[3], function (err) {
//         if (err) {
//           throw err
//         } else {
//           console.log("Successfully deleted the file.");
//         }
//       });
//     }
//   });
// }

exports.pub_camera = (devices) => {
  var mqtt = require('mqtt')
  var client = mqtt.connect(server.mqtt)
  var topic = devices + "/snapshot/set"
  client.on('connect', () => {

    client.publish(topic, "ON")
    console.log("snapshot")
    client.end()
  });
}




