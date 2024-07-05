const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

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

app.get('/data', (req, res) => {
    const sql = 'SELECT * FROM dummy_data';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
