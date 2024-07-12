const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('./models/User');
const saltRounds = 10;

let temporaryUserData = {};


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

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

// app.post('/signup', async (req, res) => {
//     try {
//         const user = await createUser(req.body);
//         res.status(201).json({ message: 'User created successfully', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating user', error });
//     }
// });

app.post('/signup', (req, res) => {
    const { userData } = req.body;
    if (!userData) {
        return res.status(400).json({ message: 'User data is required' });
    }

    const otp = '123456'; // For testing purposes
    temporaryUserData[userData.mob] = { ...userData, otp };
    console.log(`Generated OTP: ${otp}`); // Log OTP for debugging
    console.log(`Sending OTP ${otp} to mobile number ${userData.mob}`);

    res.status(200).json({ message: 'OTP sent successfully', otp });
});
// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
    const { userData } = req.body;
    if (!userData) {
        return res.status(400).json({ message: 'User data is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

    // Store OTP in temporary storage
    temporaryUserData[userData.mob] = { ...userData, otp };
    console.log(`Generated OTP: ${otp}`); // Log OTP for debugging

    // Send OTP to user's mobile number (for demonstration, we'll log it)
    console.log(`Sending OTP ${otp} to mobile number ${userData.mob}`);

    res.status(200).json({ message: 'OTP sent successfully', otp });
});

// Endpoint to verify OTP
app.post('/verify-otp', async (req, res) => {
    const { userData } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const insertUser = `INSERT INTO users (name, email, mob, dob, gender, password, date, pin, area, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(insertUser, [userData.name, userData.email, userData.mob, userData.dob, userData.gender, hashedPassword, userData.date, null, null, null, null], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'There was an error creating the account. Please try again.', error: err });
            } else {
                res.status(200).json({ message: 'Account created successfully' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'There was an error processing your request. Please try again.', error });
    }
});

// Resend OTP route
app.post('/resend-otp', (req, res) => {
    const { userData } = req.body;
    const otp = '123456'; // Replace with actual OTP generation and sending logic
    userData.otp = otp;

    res.status(200).json({ message: 'OTP resent successfully', otp });
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const token = jwt.sign({ id: user.id, email: user.EMAIL }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'Authentication successful', token, user_id: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Middleware to verify JWT
const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded.id;
        next();
    });
};

// Endpoint to get random 5 questions
app.get('/get-questions', verifyJWT, (req, res) => {
    const sql = 'SELECT * FROM questionnaire ORDER BY RAND() LIMIT 5';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint to get the latest quiz ID
app.get('/latest-quiz-id', verifyJWT, (req, res) => {
    const sql = 'SELECT MAX(quiz_id) AS latestQuizId FROM answers';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Endpoint to get user points
app.get('/user-points/:userId', verifyJWT, (req, res) => {
    const userId = req.params.userId;

    const getUserPoints = `SELECT * FROM points_log WHERE user_id = ?`;
    db.query(getUserPoints, [userId], (err, results) => {
        if (err) {
            console.log('Error fetching user points:', err);
            res.status(500).json({ message: 'Error fetching user points', error: err });
        } else {
            console.log('Fetched user points:', results);
            res.status(200).json(results);
        }
    });
});


// Endpoint to save an answer
app.post('/save-answer', verifyJWT, (req, res) => {
    const { ques_id, ans, is_correct, quiz_id } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const insertAnswer = `INSERT INTO answers (user_id, ques_id, ans, is_correct, quiz_id, date) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(insertAnswer, [req.userId, ques_id, ans, is_correct, quiz_id, date], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error saving answer', error: err });
        } else {
            res.status(200).json({ message: 'Answer saved successfully' });
        }
    });
});

// Endpoint to save quiz result
app.post('/save-quiz-result', verifyJWT, (req, res) => {
    const { score, points, quiz_id } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const insertResult = `INSERT INTO playearn (user_id, result, points, date) VALUES (?, ?, ?, ?)`;
    const insertPointsLog = `INSERT INTO points_log (user_id, points, type, remark, source, date) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(insertResult, [req.userId, score, points, date], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error saving quiz result', error: err });
        } else {
            const pointsLogRemark = `quiz - ${quiz_id}`;
            db.query(insertPointsLog, [req.userId, points, 'cr', pointsLogRemark, 'PEARN', date], (err, logResult) => {
                if (err) {
                    res.status(500).json({ message: 'Error saving points log', error: err });
                } else {
                    res.status(200).json({ message: 'Quiz result and points log saved successfully' });
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
