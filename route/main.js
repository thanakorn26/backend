var expresss = require('express');
var router = expresss.Router();
var db = require('../api/db');
var bodyParser = require('body-parser');

const mainUtil = require("../controller/main_controller");
const sht20Util = require("../controller/sht20_controller");
const cameraUtil = require("../controller/camera_controller");
const solinoidUtil = require('../controller/warter_controller');
const validateUtil = require('../controller/validate_controller');
const userUtil = require('../controller/user_controller');
const { route } = require('./camera');

// router.post('/regis', 
// mainUtil.register(),
// (req,res,next)=> {
//             res.status(200).json({
//             'success': true, 
//             message: "ส่งข้อมูลสำเร็จ"
//         });
//         next()
// });

// router.post('/send_data',
// sht20.send_to_db(),
// (req,res,next) =>{
//     res.status(200).json({
//     'success': true, 
//     message: "ส่งข้อมูลสำเร็จ"
//     });
//     next();
// });

// router.post('/send_test',
// sht20.send_test(),
// (req,res,next) =>{
//     res.status(200).json({
//     'success': true, 
//     message: "ส่งข้อมูลสำเร็จ"

//     });
//     next();
// });

router.get('/hello',
    mainUtil.get_data(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
            result: req.result
        });
        next();
    });

router.get('/time/:id',
    solinoidUtil.send_time(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
            result: req.result,
            length: req.result.length
        });
        next();
    });

router.get('/time_to_app/:id',
    solinoidUtil.send_time_setup_to_app(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
            result: res.result
        });
        next();
    });



router.get('/sht20_up/:id',
    sht20Util.send_temp_humid_to_db(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
            result: res.result
        });
    });


router.post('/setup_time', //ให้ออมเปลี่ยน
    solinoidUtil.send_time_setup_to_db(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
            result: req.result
        });
        next();
    });

router.post('/sht20_to_db',
    sht20Util.sht20_send_db(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
            result: req.result
        });
        next();
    });




// router.get('/image/camera/:camera_id',
//     function (req, res, next) {

//         require("fs").readFile(__dirname.replace("route", "") + "image/camera/" + req.params.camera_id, (err, data) => {

//             if (err !== null) {
//                 res.sendFile(__dirname.replace("route", "") + 'image/No_Image.png')
//             } else {
//                 res.sendFile(__dirname.replace("route", "") + "image/camera/" + req.params.camera_id)
//             }
//         });

//     });



module.exports = router;