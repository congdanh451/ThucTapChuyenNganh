// db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",     // ✅ Đã chiều ý bạn: Dùng localhost
  user: "root",       
  password: "",  
  database: "cuahangdoannhanh", 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;