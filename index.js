var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var logger = require('morgan');
var moment = require('moment');
var port = 3434;
var http = require('http')
var server_http = http.createServer(app)
var io = require('socket.io-client')(server);
var cron = require('node-cron')
var mm = moment();
var date = mm.utc(+7).format('DD-MM-YYYY');
var time = mm.utc(+7).format('HH: mm: ss');
var server = require("./const/constance");

var version = '/api/v1'
var mqtt = require('mqtt');
var client = mqtt.connect(server.mqtt);

const server_mosca = require("./api/mosca_server");
const mainUtil = require("./controller/main_controller");
const camera = require("./controller/camera_controller");
const solinoid = require("./controller/warter_controller");
const sht20 = require("./controller/sht20_controller");


// var mosca = require('mosca');
// server_mosca.mosca_Sever();


app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

//กำหนด header
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization, X-Access-Token')
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
});
// seave ทุกครั้งเวลามีการยิงเข้ามา
app.use(logger('dev'))
var accessLogStream = fs.createWriteStream(`${__dirname}/logs/${date}.log`, {
  flags: 'a'
});
var configlog = `[${time}] [ip]: :remote-addr :remote-user [method]: :method [url]: :url HTTP/:http-version [status]: :status [response-time]: :response-time ms [client]: :user-agent`
app.use(logger(configlog, {
  stream: accessLogStream
}));

const { createConnection } = require('net');
const { Client } = require('mosca');
var main = require('./route/main');
// const { version } = require('os');
app.use('/main' + version, main)
var camera_control = require('./route/camera');
app.use('/camera' + version, camera_control)
var user = require('./route/user');
app.use('/user' + version, user)





server_http.listen(port, () => {
  console.log("This server is on port : ", port);

});

//แจ้งเตื่อนกรณีที่ client สามารถ connect ได้
var io = require('socket.io').listen(server_http)
// var mqtt = require("mqtt")
// var client = mqtt.connect('mqtt://localhost:1234')

io.sockets.on('connection', (socket) => {
  console.log('User connected')
  socket.on('disconnect', () => {
    console.log('User Disconnect')
  });

  //รับค่ามาที่ตัวแปร data_tranfer  จากนั่นน emit ค่าไปให้ client ที่เกาะอยุ่
  socket.on('data_tranfer', (payload) => {
    // console.log("name :",payload.name)
    // console.log("test socket");

    try {

      io.emit(payload.name, payload.msg);
    } catch (err) {
      console.log('', err)
    }

  });

  socket.on('camera_control', (payload) => {
    console.log(payload)

    switch (payload.action) {
      case "snapshot":
        camera.pub_camera(payload.devices);
        break;
    }
    camera.sub_img(payload.devices);
  });


  socket.on('aom', (payload) => {
    console.log(payload)
  });

  socket.on('arduino', (payload) => {
    console.log(payload)
    // while(payload.action == "auto"){
    //     solinoid.solinoid_valve_auto()
    //     console.log("test")
    // }
    device_name = payload.device_name
    device_id = payload.device_id
    status = payload.status
    switch (device_name) {//รับค่า device จากออมมาเช็ค ในcase
      case "solenoid_valve_":
        console.log("test")
        solinoid.solinoid_valve_on(device_name + device_id, status) //ค่าแรกเป็นชื่อเซ็นเซอร์  สองรับid ของโซลินอย สามสถาณะออนออฟ
        break;
    }
    // mainUtil.pub_time();
  });
});

sht20.sub_sht20();

var mqtt = require("mqtt")
var client = mqtt.connect(server.mqtt)
client.on('connect', () => {
  client.subscribe("#")
});

client.on('message', (topic, el_message) => {
  message = el_message.toString();
  console.log("topic",topic);
  // console.log(message);
  // send_to_app(message_json);
  // update_sht20(message_json);
});


cron.schedule(' 15 * * * * *', function () {
  // sht20.send_temp_humid_to_db()
  // camera.came_1_snapshot("came_1")
  
  console.log("capture")

  // camera.pub_camera("farm/came_1")
  // camera.sub_img("farm/came_1");


});
