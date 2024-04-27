const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoute = require('./routes/route')
const postRoute = require('./routes/post-route')

const app = express()

app.use(cors())
app.use(express.json())

// app.use((req, res, next) => {
//     res.setHeader('Content-Type, Authorization');
//     next();
// });

//routes
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute)

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

