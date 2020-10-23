var io = require('socket.io-client');
var bcrypt = require('bcryptjs');
var db = require('../api/db');
var encrytp = require('../const/encrypt');
var jsonwebToken = require('jsonwebtoken');
var errorMessager = require('../const/error_message');
var constance = require('../const/constance');


exports.user_register = () => {
    return (req, res, next) => {
        console.log(req.body);

        let data = [
            null,
            req.body.email,
            encrytp.encrytp(req.body.password), // req.body.password,
            req.body.firstname,
            req.body.lastname,
            req.body.address,
            req.body.phonenumber,
            req.body.user_type
        ]


        db.query(`INSERT INTO user_information (users_id,email,password,name,last_name,address,phone_number,user_type) VALUES (?)`, [data], function (err, result) {
            if (err) throw err
            next();
        });

    }
}


exports.User_Login = () => {
    return (req, res, next) => {
        // console.log(req.body.username);
        let username = req.body.username

        db.query('SELECT * FROM user_information WHERE email = ? ', email, (err, result) => {
            if (err) throw err;//console.log(SELECT * From useraccount WHERE Username = '${Username}')
            if (result[0]) {
                let password = result[0].password
                console.log(bcrypt.compareSync(req.body.password, password))
                if (bcrypt.compareSync(req.body.password, password)) {
                
                    req.token = jsonwebToken.sign({
                        id: result[0].users_id,
                        type: result[0].type_user
                    }, constance.sign)

                    next()
                }
                else {
                    res.status(200).json(errorMessager.err_wrong_password)
                }
            }
            else {
                res.status(200).json(errorMessager.user_work_not_found)
            }
        });
    }
}

exports.facebook_login = () =>{
    return (req,res,next)=>{

    }
}


exports.get_device = () => {
    return ((req, res, next) => {

        db.query('SELECT client_id FROM device_information', (err, result) => {
            if (err) throw err
            res.result = result
            next();
        });

    });
}

exports.user_information = () => {   //ดูข้อมูล Users
    return ((req, res, next) => {
        db.query('SELECT * FROM user_information', (err, Selectresult) => {
            if (err) throw err
            else {
                res.result = Selectresult;
            }
            next();
        });
    });
}

exports.edit_data = () => {     //แก้ไขข้อมูล Users //บัค
    return ((req, res, next) => {
        
        db.query(`UPDATE user_information SET name = '${req.body.name}',last_name='${req.body.last_name}',address='${req.body.address}',phone_number='${req.body.phone_number}' WHERE users_id ='${req.params.user_id}'`, (err, Updateresult) => {
            if (err) throw err
            else {
                res.result = Updateresult;
            }
            next();
        });
    });
}

exports.delete_data = () => {  //ลบข้อมูล Users
    return ((req, res, next) => {

        db.query(`DELETE FROM user_information WHERE  users_id = '${req.params.user_id}'`, (err, result) => {
            if (err) throw err
            next();
        });

    });
}
