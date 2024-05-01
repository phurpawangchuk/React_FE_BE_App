import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import './db.js'
import { AdminRouter } from './routes/auth.js'
import { studentRouter } from './routes/student.js'
import { bookRouter } from './routes/book.js'
import { Book } from './models/Book.js'
import { Student } from './models/Student.js'
import { Admin } from './models/Admin.js'
import mongoose from "mongoose";

const app = express()
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))
app.use(cookieParser())
dotenv.config()

app.use('/auth', AdminRouter)
app.use('/student', studentRouter)
app.use('/book', bookRouter)

app.get('/dashboard', async (req, res) => {
    try {
        const student = await Student.countDocuments()
        const admin = await Admin.countDocuments()
        const book = await Book.countDocuments()
        return res.json({ ok: true, student, book, admin })
    } catch (err) {
        return res.json(err)
    }
})


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

// app.listen(process.env.PORT, () => {
//     console.log("Serve is Running");
// })