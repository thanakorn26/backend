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


router.get('/image/camera/:camera_id',
    function (req, res, next) {

        require("fs").readFile(__dirname.replace("route", "") + "image/camera/" + req.params.camera_id, (err, data) => {

            if (err !== null) {
                res.sendFile(__dirname.replace("route", "") + 'image/No_Image.png')
            } else {
                res.sendFile(__dirname.replace("route", "") + "image/camera/" + req.params.camera_id)
            }
        });

    });


router.get('/image/profile_user/:camera_id',
    function (req, res, next) {

        require("fs").readFile(__dirname.replace("route", "") + "image/profile_user/" + req.params.camera_id, (err, data) => {

            if (err !== null) {
                res.sendFile(__dirname.replace("route", "") + 'image/No_Image.png')
            } else {
                res.sendFile(__dirname.replace("route", "") + "image/profile_user/" + req.params.camera_id)
            }
        });

    });







module.exports = router;