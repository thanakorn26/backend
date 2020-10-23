var db = require('../api/db');


exports.validate_user_register = () => {
    return ((req, res, next) => {
        console.log(req.body)
        if (req.body.username &&
            req.body.password &&
            req.body.name &&
            req.body.last_name &&
            req.body.address &&
            req.body.phone_number) {
            next();
        }
        else {
            // res.status(200).json(errorMessages.invalid_data)
        }
    });
}

exports.validate_user_login = () => {
    return ((req, res, next) => {
        console.log(req.body);
        if (req.body.username &&
            req.body.password) {
            next();
        }
        else {
            res.status(200).json(errorMessages.invalid_data)
        }
    });
}

exports.validate_user_password = () => {
    return ((req, res, next) => {
        console.log(req.body);
        if (req.body.password &&
            req.body.newpassword) {
            next();
        }
    });
}

exports.validate_edit_data = () => {
    return ((req, res, next) => {
        console.log(req.body);
        if (req.body.username &&
            req.body.password &&
            req.body.name &&
            req.body.last_name &&
            req.body.address &&
            req.body.phone_number) {
            next();
        }
    });
}