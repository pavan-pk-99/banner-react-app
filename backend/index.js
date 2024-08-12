const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bannerDB'
});

// Function to initialize the banner table and dummy data
const initializeBannerData = () => {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS banner (
            id INT PRIMARY KEY,
            description VARCHAR(255),
            timer INT,
            link VARCHAR(255),
            is_visible BOOLEAN
        );
    `;
    
    db.query(createTableSQL, (err) => {
        if (err) throw err;
        console.log('Banner table checked/created');

        // Now check if the dummy data exists
        const sqlCheck = 'SELECT COUNT(*) AS count FROM banner WHERE id = 1';
        db.query(sqlCheck, (err, result) => {
            if (err) throw err;

            if (result[0].count === 0) {
                const sqlInsert = `INSERT INTO banner (id, description, timer, link, is_visible) VALUES (?, ?, ?, ?, ?)`;
                const dummyData = [1, 'Welcome to Our Website!', 3600, 'https://example.com', true]; // Example dummy data
                
                db.query(sqlInsert, dummyData, (err) => {
                    if (err) throw err;
                    console.log('Initialized dummy banner data');
                });
            }
        });
    });
};

// Connect to MySQL and initialize banner data
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
    initializeBannerData(); // Initialize table and dummy data on server start
});

// Get banner data
app.get('/banner', (req, res) => {
    const sql = 'SELECT * FROM banner WHERE id = 1';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});

// Update banner data
app.put('/banner', (req, res) => {
    const { description, timer, link, is_visible } = req.body;
    const sql = `UPDATE banner SET description = ?, timer = ?, link = ?, is_visible = ? WHERE id = 1`;
    db.query(sql, [description, timer, link, is_visible], (err, result) => {
        if (err) throw err;
        res.send('Banner updated successfully');
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
