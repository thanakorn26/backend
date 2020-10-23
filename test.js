// var moment = require('moment')
// var db = require('../api/db');



// exports.send_time = () => {
//     return ((req, res, next) => {
//         // console.log("time : ",time)

//         db.query(`SELECT device_critical FROM devices_information WHERE client_id = '${req.params.id}'`, (err, result) => {
//             if (err) throw err
//             else {
//                 let data = []
//                 let hour = null
//                 let min = null
//                 let sec = null
//                 let status = null
//                 let time_array = null
//                 let time_test = moment().format('HH:mm')
                

//                 result.map((e) => {
//                     time_array = JSON.parse(e.device_critical)
                    
//                 })
                
//                 time_array.map((e_time) => {

//                     let hour = moment(e_time.time).format('HH:mm:ss')

//                     // console.log(moment(e_time.time).format('HH:mm'))
//                     // console.log(time_test)
//                     if (e_time.time < time_test) {
//                         // console.log("0")
//                         status = 0
//                     }
//                     else {
//                         // console.log("1")
//                         status = 1
//                     }

//                     h = moment(e_time.time).format('H');
//                     m = moment(e_time.time).format('m');
//                     s = moment(e_time.time).format('s');

//                     hour = parseInt(h);
//                     min = parseInt(m);
//                     sec = parseInt(s);
                    

//                     data.push({
//                         hour: hour,
//                         min: min,
//                         sec: sec,
//                         action: e_time.action,
//                         status: status
//                     });

//                     console.log(data)
//                 })

//                 // let device_critical = null
//                 // if (result[0]) { //เช็คข้อมูล
//                 //     device_critical = JSON.parse(result[0].device_critical) //ทำให้เป็น json
//                 //     // console.log(device_critical)
//                 // }

//                 // device_critical.map((e_result) => {
//                 //     // console.log("time : ",moment(e_result.time).format('HH: mm: ss'))
//                 //     let time_array = moment(e_result.time).format('H: m: s')

//                 //     // console.log(time_array)
//                 //     // console.log(time)
//                 //     if (time_array < time_test) {
//                 //         // console.log("0")
//                 //         status = 0
//                 //     }
//                 //     else {
//                 //         // console.log("1")
//                 //         status = 1
//                 //     }

//                 //     h = moment(e_result.time).format('H');
//                 //     m = moment(e_result.time).format('m');
//                 //     s = moment(e_result.time).format('s');
//                 //     console.log(e_result.time)
//                 //     hour = parseInt(h);
//                 //     min = parseInt(m);
//                 //     sec = parseInt(s);
//                 //     length = e_result.length;

//                 //     // console.log(length);
//                 //     data.push({
//                 //         hour: hour,
//                 //         min: min,
//                 //         sec: sec,
//                 //         action: e_result.action,
//                 //         status: status
//                 //     });

//                 // });
//                 req.result = data

//                 next();
//             }
//         });

//     });
// }


mainUtil.send_data_to_db()