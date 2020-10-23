var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: '', //email
      pass: ''  //password
   }
});

module.exports = {
   
   // //farmpassion5G,2.4G
   // server: '192.168.1.96:3434' ,
   // mqtt: 'mqtt://192.168.1.96:1234', 
   // socket: 'http://127.0.0.1:3434' 
   sign: 'secret',
   sign_admin: 'secretAdmin',
   //farmpassion
   server: '192.168.0.57:3434' ,
   mqtt: 'mqtt://127.0.0.1:1234', 
   socket: 'http://127.0.0.1:3434' 
}

