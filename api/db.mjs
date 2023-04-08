import mysql from "mysql";

import util from "util";

const config = {
  host: "localhost",
  user: "user",
  password: "password",
  port: 3306,
  database: "crowdfunding",
};

export const makeDb = () => {
  const connection = mysql.createConnection(config);
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
  };
}

// export const db = mysql.createConnection({
//   host: "localhost",
//   user: "user",
//   password: "password",
//   port: 3306,
//   database: "crowdfunding",
// });

// db.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
//   // db.query("DROP USER user")
//   // db.query("CREATE USER 'user'@'%' IDENTIFIED BY 'password'")
//   // db.query("GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER ON *.* TO 'user'@'%' WITH GRANT OPTION")
//   db.query(
//     "CREATE DATABASE IF NOT EXISTS crowdfunding",
//     function (err, result, fields) {
//       if (err) throw err;
//       // console.log(result);
//     }
//   );
//   const donatorsTableCreationQuery = `CREATE TABLE IF NOT EXISTS donators (
//     username VARCHAR(255) NOT NULL, 
//     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )`;

//   db.query(donatorsTableCreationQuery, function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//   });
//   const campaignsTableCreationQuery = `CREATE TABLE IF NOT EXISTS campaigns (
//     name VARCHAR(255) NOT NULL, 
//     description VARCHAR(255), 
//     goal INT, 
//     status ENUM('active', 'fraud', 'successful') DEFAULT 'active' NOT NULL, 
//     id VARCHAR(255) NOT NULL PRIMARY KEY, 
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
//   db.query(campaignsTableCreationQuery, function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//   });
//   //   Amount in US dollars
//   // The nickname of the donator
//   // State - can be 'valid' (when new) or 'fraud'
//   const donationsTableCreationQuery = `CREATE TABLE IF NOT EXISTS donations ( 
//     id INT NOT NULL PRIMARY KEY,
//     amount INT NOT NULL,
//     donator_id INT NOT NULL, 
//     state ENUM('valid', 'fraud') DEFAULT 'valid' NOT NULL, 
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
//     FOREIGN KEY (donator_id)
//     REFERENCES donators (id)
//     )`;

//   db.query(donationsTableCreationQuery, function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     // db.end();
//   });
// });
