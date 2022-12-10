const mysql = require('mysql')

const config = require('./db_config')

const connection = mysql.createConnection(config)


/* cnnect to mysql */
connection.connect((err) => {
  if (err) {
      console.error('error connecting: ' + err.stack);
      return;
  }
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;