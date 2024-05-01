const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoute = require('./routes/route')
const postRoute = require('./routes/post-route')
const bodyParser = require('body-parser');
const multer = require('multer');
// const csrf = require('csurf');
const app = express()
const path = require('path');
const cookieParser = require('cookie-parser');

const mysql = require('mysql2');

app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}))
// app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Allow image folder to access
app.use('/public/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

//For file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//routes
app.use('/api/users', userRoute);
app.use('/api/posts', upload.single('image'), postRoute);

// app.use(csrfProtection);
mongoose.connect("mongodb+srv://phurpawangchuk20:WbAYAnfpLtNhejQw@ReactAppDB.e47qdme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to MongoDB Atlas");
        app.listen(3000, () => {
            console.log("Server is listening on port 3000");
        });
    })
    .catch((error) => {
        console.log("Connection failed:", error.message);
    });


    /*//MySQL connection
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'CS422DB',
    port: 3308
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error getting connection from pool:', err);
        return;
    }
    console.log("COnnected ..", connection)
    // connection.query('SELECT * FROM your_table', (error, results, fields) => {
    //     // Handle query results
    //     connection.release(); // Release the connection back to the pool
    // });
});
*/

