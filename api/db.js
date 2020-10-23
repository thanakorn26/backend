var mysql = require('mysql');
var con = mysql.createConnection({
  host: "192.168.64.2",
  user: "forest",
  password: "",
  database: "forest_schema"
});
con.connect(function(err) {
  if (err) throw err;
  console.log(con.state);
  
})
module.exports = con;