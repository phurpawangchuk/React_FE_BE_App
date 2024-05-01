import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import StudentModel from './models/Student.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}))


mongoose.connect("mongodb+srv://phurpawangchuk20:WbAYAnfpLtNhejQw@ReactAppDB.e47qdme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to MongoDB Atlas");
        app.listen(3000, () => {
            console.log("Server is listening on port 3001");
        });
    })
    .catch((error) => {
        console.log("Connection failed:", error.message);
    });


app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    StudentModel.create({ name, email, password })
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    StudentModel.findOne({ email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    const accessToken = jwt.sign({ email: email },
                        "jwt-access-token-secret-key", { expiresIn: '1m' })

                    const refreshToken = jwt.sign({ email: email },
                        "jwt-refresh-token-secret-key", { expiresIn: '5m' })

                    res.cookie('accessToken', accessToken, { maxAge: 60000 })

                    res.cookie('refreshToken', refreshToken,
                        { maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict' })

                    return res.json({
                        accessToken,
                        refreshToken,
                        Login: true
                    })
                }
            } else {
                res.json({ Login: false, Message: "no record" })
            }
        }).catch(err => res.json(err))
})

const varifyUser = (req, res, next) => {
    const accesstoken = req.cookies.accessToken;
    console.log("req.cookies.accessToken ==", req.cookies.accessToken)
    if (!accesstoken) {
        if (renewToken(req, res)) {
            next()
        }
    } else {
        jwt.verify(accesstoken, 'jwt-access-token-secret-key', (err, decoded) => {
            if (err) {
                return res.json({ valid: false, message: "Invalid Token" })
            } else {
                req.email = decoded.email
                next()
            }
        })
    }
}

// const renewToken = (req, res, next) => {
//     const refreshtoken = req.cookies.refreshToken;
//     if (!refreshtoken) {
//         return res.json({ valid: false, message: "No Refresh token" });
//     }

//     jwt.verify(refreshtoken, 'jwt-refresh-token-secret-key', (err, decoded) => {
//         if (err) {
//             return res.json({ valid: false, message: "Invalid Refresh Token" });
//         }

//         const accessToken = jwt.sign({ email: decoded.email },
//             "jwt-access-token-secret-key", { expiresIn: '1m' });

//         res.cookie('accessToken', accessToken, { maxAge: 60000 });
//         next(); // Call next() to continue with the request processing
//     });
// };


const renewToken = (req, res) => {
    const refreshtoken = req.cookies.refreshToken;
    let exist = false;
    if (!refreshtoken) {
        return res.json({ valid: false, message: "No Refresh token" })
    } else {
        jwt.verify(refreshtoken, 'jwt-refresh-token-secret-key', (err, decoded) => {
            if (err) {
                return res.json({ valid: false, message: "Invalid Refresh Token" })
            } else {
                const accessToken = jwt.sign({ email: decoded.email },
                    "jwt-access-token-secret-key", { expiresIn: '1m' })
                res.cookie('accessToken', accessToken, { maxAge: 60000 })
                exist = true;
            }
        })
    }
    return exist;
}

app.get('/dashboard', varifyUser, (req, res) => {
    res.json({
        valid: true,
        message: "authorized"
    })
    //  res.json({ valid: true, message: "authorized" })
})
