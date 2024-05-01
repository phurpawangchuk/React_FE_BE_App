const express = require('express')
const router = express.Router();
const { createUser, getAllUsers, getUser, login, register, updateUser, deleteUser } = require('../controller/userController')
const { body } = require('express-validator');
const User = require('../model/user');
const isAuth = require('../middleware/is-auth');

router.post('/', isAuth, [
    body('name').trim().isLength({ min: 5 })
        .withMessage('Name field must be minimum of 5 characters'),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(async (value, { req }) => {
            try {
                const existingUser = await User.findOne({ email: value });
                if (existingUser) {
                    return Promise.reject('Email already exists');
                }
                return true;
            } catch (error) {
                throw new Error('Database error');
            }
        })
        .normalizeEmail(),
    body('age').trim().isLength({ max: 3 })
        .withMessage('Age must be correct.'),
], createUser);
router.get('/', isAuth, getAllUsers);
router.get('/:id', isAuth, getUser);
router.put('/:id', isAuth, updateUser);
router.delete('/:id', isAuth, deleteUser);
router.post('/auth', login);
router.post('/register', register);


module.exports = router;

