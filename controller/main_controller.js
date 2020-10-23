var bcrypt = require('bcryptjs');
var mqtt = require('mqtt');
var io = require('socket.io-client');
const { json } = require('body-parser');
var moment = require('moment');
var db = require('../api/db');
var server = require("../const/constance");
const e = require('express');
var time_zone = moment().utc(+7).format('DD/MM/YYY HH: mm: ss');
// var canstance = require('../const/constance');
const solinoid = require('../controller/warter_controller');

exports.get_data = () => {
    return ((req, res, next) => {

        db.query('SELECT * FROM sht20_information', (err, projectResult) => {
            if (err) throw err
            req.result = projectResult
            next();
        });


    });
}



