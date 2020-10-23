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



router.get('/device_info',
    userUtil.get_device(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
            result: res.result
        });
        next();
    });

router.get('/user_information',
    userUtil.user_information(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
            result: res.result
        });
    });

router.post('/user_register',
    // validateUtil.validate_user_register(),
    userUtil.user_register(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
            message: 'บันทึกข้อมูลสำเร็จ'
        });
        next();
    });

router.post('/user_login',
    validateUtil.validate_user_login(),
    userUtil.User_Login(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
           token: req.token,
           message : 'เข้าสู่ระบบสำเร็จ'
        });
        next();
    });

router.put('/user_edit/:user_id',
    userUtil.edit_data(),
    // validateUtil.validate_edit_data(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
            message: 'แก้ไขข้อมูลสำเร็จ'
        });
        next();
    });

router.delete('/user_delete/:user_id',
    userUtil.delete_data(),
    (req, res, next) => {
        res.status(200).json({
            'success': true,
            message: 'ลบข้อมูลสำเร็จ'
        });
        next();
    });


module.exports = router;