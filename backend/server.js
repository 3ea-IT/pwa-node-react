const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('./models/User');
const saltRounds = 10;
const nodemailer = require('nodemailer');

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

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: 'mail.3eaglobal.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'noreply@3eaglobal.com',
        pass: '$Td5i&A%rkZB'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Send OTP email function
const sendOtpEmail = (email, otp) => {
    const mailOptions = {
        from: '"Dr. Haslab" <noreply@3eaglobal.com>',
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP for password reset is ${otp}`,
        html: `<p>Your OTP for password reset is <b>${otp}</b></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
    });
};

const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

app.post('/signup', (req, res) => {
    console.log('Received signup request:', req.body);
    const { userData } = req.body;
    if (!userData) {
        return res.status(400).json({ message: 'User data is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    temporaryUserData[userData.mob] = { ...userData, otp };
    console.log('Updated temporary user data:', temporaryUserData);

    res.status(200).json({ message: 'OTP sent successfully', otp });
});

app.post('/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await findUserByEmail(email);
  
      if (!user) {
        return res.status(401).json({ message: 'Email not found' });
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
      temporaryUserData[email] = { otp, userId: user.id, timestamp: Date.now() };
  
      sendOtpEmail(email, otp);
  
      res.status(200).json({ message: 'OTP sent to email. Please wait this might take 1-2 miutes.' });
    } catch (error) {
      res.status(500).json({ message: 'Error processing request', error });
    }
  });
  
  app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
  
    const userData = temporaryUserData[email];
  
    if (!userData || userData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  
    const currentTime = Date.now();
    if (currentTime - userData.timestamp > 10 * 60 * 1000) { // OTP valid for 10 minutes
      delete temporaryUserData[email];
      return res.status(400).json({ message: 'OTP expired' });
    }
  
    res.status(200).json({ message: 'OTP verified' });
  });
  
  app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
  
    const userData = temporaryUserData[email];
  
    if (!userData) {
      return res.status(400).json({ message: 'Invalid request' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const query = 'UPDATE users SET password = ? WHERE id = ?';
  
      db.query(query, [hashedPassword, userData.userId], (err, results) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ message: 'Server error' });
        }
  
        // Remove the user data from temporary storage after successful password reset
        delete temporaryUserData[email];
  
        res.status(200).json({ message: 'Password reset successful' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating password', error });
    }
  });
  

app.post('/validate-referral', (req, res) => {
    const { referralCode } = req.body;
    const query = 'SELECT COUNT(*) AS count FROM users WHERE referral_code = ?';

    db.query(query, [referralCode], (err, results) => {
        if (err) {
            console.error('Error validating referral code:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        const isValid = results[0].count > 0;
        res.json({ isValid });
    });
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
        console.log("Starting OTP verification...");
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        let referralCode = generateReferralCode();

        // Check if the generated referral code is unique
        const checkUniqueCode = async (code) => {
            const query = 'SELECT COUNT(*) AS count FROM users WHERE referral_code = ?';
            return new Promise((resolve, reject) => {
                db.query(query, [code], (err, results) => {
                    if (err) return reject(err);
                    resolve(results[0].count === 0);
                });
            });
        };

        // Ensure the referral code is unique
        let isUnique = await checkUniqueCode(referralCode);
        while (!isUnique) {
            referralCode = generateReferralCode();
            isUnique = await checkUniqueCode(referralCode);
        }

        let walletPoints = 50;
        let referredBy = null;
        let referringUserId = null;

        if (userData.referralCode) {
            const checkReferralCodeQuery = 'SELECT id FROM users WHERE referral_code = ?';
            const [rows] = await db.promise().query(checkReferralCodeQuery, [userData.referralCode]);

            if (rows.length > 0) {
                referredBy = userData.referralCode;
                walletPoints = 70;

                referringUserId = rows[0].id;
                const updateReferrerWalletQuery = 'UPDATE users SET wallet = wallet + 100 WHERE id = ?';
                await db.promise().query(updateReferrerWalletQuery, [referringUserId]);

                const insertPointsLogReferrer = `INSERT INTO points_log (user_id, points, type, remark, source, date) VALUES (?, ?, 'cr', 'Referral bonus', 'RB', ?)`;
                const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                await db.promise().query(insertPointsLogReferrer, [referringUserId, 100, date]);

                // Insert into referral table for the referrer
                const insertReferralReferrer = `INSERT INTO referral (from_id, to_id, points, date, remark) VALUES (?, ?, ?, ?, 'RB')`;
                await db.promise().query(insertReferralReferrer, [referringUserId, null, 100, date]); // Using null for now, will update after inserting the new user
            } else {
                return res.status(400).json({ message: 'Invalid referral code. Please try again.' });
            }
        }

        const insertUser = `INSERT INTO users (name, email, mob, dob, gender, password, date, pin, area, city, state, referral_code, referred_by, wallet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(insertUser, [userData.name, userData.email, userData.mob, userData.dob, userData.gender, hashedPassword, userData.date, null, null, null, null, referralCode, referredBy, walletPoints], async (err, result) => {
            if (err) {
                console.log('Error inserting user:', err);
                res.status(500).json({ message: 'There was an error creating the account. Please try again.', error: err });
            } else {
                const userId = result.insertId;
                const insertPointsLogNewUser = `INSERT INTO points_log (user_id, points, type, remark, source, date) VALUES (?, ?, 'cr', ?, ?, ?)`;
                const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                const remark = referredBy ? 'Joining Bonus via Referral' : 'Direct Joining Bonus';
                const source = referredBy ? 'JBR' : 'DJB';

                await db.promise().query(insertPointsLogNewUser, [userId, walletPoints, remark, source, date]);

                // Update referral entry for referrer with the new user's ID
                if (referredBy) {
                    const updateReferralReferrer = `UPDATE referral SET to_id = ? WHERE from_id = ? AND to_id IS NULL AND remark = 'RB' AND date = ?`;
                    await db.promise().query(updateReferralReferrer, [userId, referringUserId, date]);

                    // Insert into referral table for the new user
                    const insertReferralNewUser = `INSERT INTO referral (from_id, to_id, points, date, remark) VALUES (?, ?, ?, ?, 'JBR')`;
                    await db.promise().query(insertReferralNewUser, [userId, referringUserId, 70, date]);
                } else {
                    // Insert into referral table for the new user without a referrer
                    const insertReferralNewUser = `INSERT INTO referral (from_id, to_id, points, date, remark) VALUES (0, ?, ?, ?, 'DJB')`;
                    await db.promise().query(insertReferralNewUser, [userId, 50, date]);
                }

                res.status(200).json({ message: 'Account created successfully' });
            }
        });
    } catch (error) {
        console.log('Error processing OTP verification:', error);
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

app.post('/update-phone', (req, res) => {
    console.log('Received update-phone request:', req.body);
    const { oldMob, newMob } = req.body;
    if (!oldMob || !newMob) {
        return res.status(400).json({ message: 'Old and new mobile numbers are required' });
    }

    console.log('Temporary user data:', temporaryUserData);

    if (temporaryUserData[oldMob]) {
        const userData = temporaryUserData[oldMob];
        delete temporaryUserData[oldMob];
        userData.mob = newMob;
        temporaryUserData[newMob] = userData;

        // Generate and send new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        temporaryUserData[newMob].otp = otp;
        console.log(`Sending new OTP ${otp} to mobile number ${newMob}`);

        res.status(200).json({ message: 'Phone number updated and new OTP sent successfully', otp });
    } else {
        res.status(404).json({ message: 'User data not found' });
    }
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

// Fetch monthly points history for the user
app.get('/user-points-history/:id', async (req, res) => {
    const userId = req.params.id;
    try {
      const query = `
        SELECT DATE_FORMAT(date, '%Y-%m') as month, SUM(points) as value
        FROM points_log
        WHERE user_id = ?
        GROUP BY DATE_FORMAT(date, '%Y-%m')
        ORDER BY DATE_FORMAT(date, '%Y-%m') DESC
        LIMIT 5;
      `;
      const [results] = await db.promise().query(query, [userId]);
  
      // Prepare data to send to the frontend
      const data = results.map(result => ({
        month: result.month,
        value: result.value
      }));
  
      res.json(data);
    } catch (error) {
      console.error('Error fetching user points history:', error);
      res.status(500).json({ message: 'Error fetching user points history.' });
    }
  });  

//get user info
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    // Fetch the user data from your database
    const query = 'SELECT name, mob, referral_code FROM users WHERE id = ?';
    db.query(query, [userId], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error fetching user data' });
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else if (results.length === 0) {
                res.status(404).json({ message: 'User not found' });
            } else {
                res.json(results[0]);
            }
        }
    });
});

// Fetch profile details
app.get('/user-profile/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT name, email, dob, gender FROM users WHERE id = ?';
    db.query(query, [userId], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error fetching user data' });
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }
    });
});


// Fetch wallet points for the user
app.get('/user-wallet/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT wallet FROM users WHERE id = ?';
    db.query(query, [userId], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error fetching wallet points' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Fetch recent transactions for the user
app.get('/transactions/:userId', async (req, res) => {
    const userId = req.params.userId;
    const query = `
      SELECT points, type, source, date 
      FROM points_log 
      WHERE user_id = ? 
      ORDER BY date DESC 
      LIMIT 5
    `;
    try {
      const [rows] = await db.promise().query(query, [userId]);
      res.status(200).json({ transactions: rows });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Error fetching transactions.', error });
    }
  });
  

// Fetch recent invites with points earned by the user making referrals
app.get('/recent-invites/:referralCode', (req, res) => {
    const referralCode = req.params.referralCode;
    const query = `
        SELECT u.name, r.points, r.date 
        FROM users u 
        JOIN referral r ON u.id = r.to_id 
        WHERE r.from_id = (SELECT id FROM users WHERE referral_code = ?) 
        ORDER BY r.date DESC 
        LIMIT 2
    `;
    db.query(query, [referralCode], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error fetching recent invites with points' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Fetch all invited friends with points earned by the user making referrals
app.get('/invited-friends/:referralCode', (req, res) => {
    const referralCode = req.params.referralCode;
    const query = `
        SELECT u.name, r.points, r.date 
        FROM users u 
        JOIN referral r ON u.id = r.to_id 
        WHERE r.from_id = (SELECT id FROM users WHERE referral_code = ?) 
        ORDER BY r.date DESC
    `;
    db.query(query, [referralCode], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error fetching invited friends with points' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Fetch notifications for a user
app.get('/notifications/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM push_logs WHERE user_id = ? AND remark = 1 ORDER BY date DESC';

    db.query(query, [userId], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error fetching notifications', error });
        } else {
            res.status(200).json(results);
        }
    });
});

// Update remark to 0 and remove the notification
app.post('/mark-notification-read', (req, res) => {
    const { notificationId } = req.body;
    const query = 'UPDATE push_logs SET remark = 0 WHERE id = ?';

    db.query(query, [notificationId], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error marking notification as read', error });
        } else {
            res.status(200).json({ message: 'Notification marked as read' });
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
    const getUserWallet = `SELECT wallet FROM users WHERE id = ?`;
    const updateUserWallet = `UPDATE users SET wallet = ? WHERE id = ?`;

    db.query(insertResult, [req.userId, score, points, date], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error saving quiz result', error: err });
        } else {
            const pointsLogRemark = `quiz - ${quiz_id}`;
            db.query(insertPointsLog, [req.userId, points, 'cr', pointsLogRemark, 'PEARN', date], (err, logResult) => {
                if (err) {
                    res.status(500).json({ message: 'Error saving points log', error: err });
                } else {
                    // Fetch the current wallet points
                    db.query(getUserWallet, [req.userId], (err, walletResult) => {
                        if (err) {
                            res.status(500).json({ message: 'Error fetching wallet points', error: err });
                        } else {
                            const currentWalletPoints = walletResult[0].wallet;
                            const updatedWalletPoints = currentWalletPoints + points;

                            // Update the wallet points in the users table
                            db.query(updateUserWallet, [updatedWalletPoints, req.userId], (err, updateResult) => {
                                if (err) {
                                    res.status(500).json({ message: 'Error updating wallet points', error: err });
                                } else {
                                    res.status(200).json({ message: 'Quiz result, points log, and wallet updated successfully' });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// Fetch KYC data for the user
app.get('/kyc/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT * FROM kyc WHERE user_id = ?';
  
    db.query(query, [userId], (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error fetching KYC data', error });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

//Fetch medical Questions
app.get('/medical-questions', verifyJWT, (req, res) => {
    const query = 'SELECT * FROM medical_questionnaire';
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error fetching medical questions', error });
        } else {
            res.status(200).json(results);
        }
    });
});

  
  app.post('/save-kyc', verifyJWT, (req, res) => {
    const { userId, pincode, area, city, state, country, gender, height, weight, bloodGroup, age } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const checkQuery = 'SELECT * FROM kyc WHERE user_id = ?';
    const updateQueryBasic = 'UPDATE kyc SET pincode = ?, area = ?, city = ?, state = ?, country = ? WHERE user_id = ?';
    const updateQueryVitals = 'UPDATE kyc SET gender = ?, height = ?, weight = ?, blood_group = ?, age = ? WHERE user_id = ?';
    const insertQuery = 'INSERT INTO kyc (user_id, pincode, area, city, state, country, gender, height, weight, blood_group, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const logQuery = 'INSERT INTO kyc_logs (user_id, type, remark, date) VALUES (?, ?, ?, ?)';
    const vitalsQuery = 'INSERT INTO vitals (user_id, weight, date) VALUES (?, ?, ?)';

    db.query(checkQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error checking KYC data:', err);
            res.status(500).json({ message: 'Error checking KYC data', error: err });
        } else if (results.length > 0) {
            // User already has KYC data
            const existingData = results[0];

            if (pincode || area || city || state || country) {
                const updateValues = [pincode, area, city, state, country, userId];
                db.query(updateQueryBasic, updateValues, (err, updateResult) => {
                    if (err) {
                        console.error('Error updating KYC data:', err);
                        res.status(500).json({ message: 'Error updating KYC data', error: err });
                    } else {
                        const fieldsToUpdate = { pincode, area, city, state, country };
                        Object.keys(fieldsToUpdate).forEach(field => {
                            if (fieldsToUpdate[field] && fieldsToUpdate[field] !== existingData[field]) {
                                db.query(logQuery, [userId, field, existingData[field] ? 'updated' : 'added', date], (logErr) => {
                                    if (logErr) {
                                        console.error(`Error updating KYC log for ${field}:`, logErr);
                                    }
                                });
                            }
                        });
                        res.status(200).json({ message: 'KYC basic data updated successfully' });
                    }
                });
            }

            if (gender || height || weight || bloodGroup || age) {
                const updateValues = [gender, height, weight, bloodGroup, age, userId];
                db.query(updateQueryVitals, updateValues, (err, updateResult) => {
                    if (err) {
                        console.error('Error updating KYC data:', err);
                        res.status(500).json({ message: 'Error updating KYC data', error: err });
                    } else {
                        const fieldsToUpdate = { gender, height, weight, bloodGroup, age };
                        Object.keys(fieldsToUpdate).forEach(field => {
                            if (fieldsToUpdate[field] && fieldsToUpdate[field] !== existingData[field]) {
                                const remark = existingData[field] ? 'updated' : 'added';
                                db.query(logQuery, [userId, field, remark, date], (logErr) => {
                                    if (logErr) {
                                        console.error(`Error updating KYC log for ${field}:`, logErr);
                                    }
                                });

                                if (field === 'weight') {
                                    db.query(vitalsQuery, [userId, weight, date], (vitalsErr) => {
                                        if (vitalsErr) {
                                            console.error('Error updating vitals data:', vitalsErr);
                                        }
                                    });
                                }
                            }
                        });
                        res.status(200).json({ message: 'KYC vitals data updated successfully' });
                    }
                });
            }
        } else {
            const insertValues = [userId, pincode, area, city, state, country, gender, height, weight, bloodGroup, age];
            db.query(insertQuery, insertValues, (err, insertResult) => {
                if (err) {
                    console.error('Error inserting KYC data:', err);
                    res.status(500).json({ message: 'Error inserting KYC data', error: err });
                } else {
                    const fieldsToInsert = { pincode, area, city, state, country, gender, height, weight, bloodGroup, age };
                    Object.keys(fieldsToInsert).forEach(field => {
                        if (fieldsToInsert[field]) {
                            db.query(logQuery, [userId, field, 'added', date], (logErr) => {
                                if (logErr) {
                                    console.error(`Error logging KYC insertion for ${field}:`, logErr);
                                }
                            });

                            if (field === 'weight') {
                                db.query(vitalsQuery, [userId, weight, date], (vitalsErr) => {
                                    if (vitalsErr) {
                                        console.error('Error inserting vitals data:', vitalsErr);
                                    }
                                });
                            }
                        }
                    });
                    res.status(200).json({ message: 'KYC data inserted successfully' });
                }
            });
        }
    });
});


  // Log KYC updates
  function logKYCUpdate(userId, newData) {
    const query = 'INSERT INTO kyc_logs (user_id, type, remark) VALUES (?, ?, ?)';
    const fields = ['pincode', 'area', 'city', 'state', 'country', 'gender', 'height', 'weight', 'bloodGroup', 'age'];
    
    db.query('SELECT * FROM kyc WHERE user_id = ?', [userId], (err, oldData) => {
      if (err) {
        console.error('Error fetching old KYC data:', err);
      } else {
        fields.forEach((field) => {
          if (newData[field] !== undefined) {
            if (!oldData[0][field]) {
              db.query(query, [userId, field, 'added'], (error, results) => {
                if (error) {
                  console.error('Error logging KYC update (added):', error);
                }
              });
            } else if (oldData[0][field] !== newData[field]) {
              db.query(query, [userId, field, 'updated'], (error, results) => {
                if (error) {
                  console.error('Error logging KYC update (updated):', error);
                }
              });
            }
          }
        });
      }
    });
  }
  
  // Save medical answers
  app.post('/save-medical-answers', verifyJWT, (req, res) => {
    const { userId, answers } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!userId || !answers) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const insertAnswer = 'INSERT INTO answers_medical (user_id, ques_id, ans, date) VALUES (?, ?, ?, ?)';
    const answerQueries = answers.map(answer => {
        return new Promise((resolve, reject) => {
            db.query(insertAnswer, [userId, answer.question_id, answer.answer, date], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });

    Promise.all(answerQueries)
        .then(results => {
            res.status(200).json({ message: 'Medical answers saved successfully' });
        })
        .catch(error => {
            console.error('Error saving medical answers:', error);
            res.status(500).json({ message: 'Error saving medical answers', error });
        });
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
