const mysql = require("../../node_modules/mysql");

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "panda",
  database: "database_development",
  password: "jesaispas",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
    if (!err) {
      console.log("Connected");
    } else {
      console.log("Connection Failed");
    }
  });
  
  module.exports = mysqlConnection;