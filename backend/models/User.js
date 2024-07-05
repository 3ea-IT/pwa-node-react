const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // your password
    database: 'pwa-react-node'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

const createUser = async (userData) => {
    const { name, email, mob, password, date, dob, gender, pin, area, city, state } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (NAME, EMAIL, MOB, PASSWORD, DATE, DOB, GENDER, PIN, AREA, CITY, STATE)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, email, mob, hashedPassword, date, dob, gender, pin, area, city, state];
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const findUserByEmail = (email) => {
    const sql = `SELECT * FROM users WHERE EMAIL = ?`;
    return new Promise((resolve, reject) => {
        db.query(sql, [email], (err, result) => {
            if (err) reject(err);
            resolve(result[0]);
        });
    });
};

module.exports = {
    createUser,
    findUserByEmail
};
