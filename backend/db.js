const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "garima",
    database: "hydrocivic"
});

db.connect((err) => {
    if (err) {
        console.error("Database Connection Failed:", err);
    } else {
        console.log("MySQL Connected");
    }
});

module.exports = db;