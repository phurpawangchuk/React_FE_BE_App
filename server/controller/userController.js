const User = require('../model/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'User not found.'
                });
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                return res.status(401).json({
                    message: 'Provided wrong password.'
                });
            }

            const accessToken = jwt.sign({ email: email, userId: loadedUser._id.toString() },
                "secretkeyhere", { expiresIn: '15m' })

            const refreshToken = jwt.sign({ email: email },
                "jwt-refresh-token-secret-key", { expiresIn: '5m' })

            res.cookie('accessToken', accessToken, { maxAge: 60000 })

            res.cookie('refreshToken', refreshToken, {
                maxAge: 300000,
                httpOnly: true,  // Set httpOnly to true
                secure: true,
                sameSite: 'strict'
            });

            return res.status(200).json({
                accessToken,
                refreshToken,
                username: loadedUser.name,
                userId: loadedUser._id.toString()
            })
        })
        .catch(error => {
            res.status(500).json({ message: 'Validation of fields failed.Error:' + error });
        })
}

const register = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed.',
            errors: errors.array()
        });
    }
    try {
        const { name, email, age, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ name, email, age, password: hashedPassword });
        res.status(201).json({ user, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Validation of fields failed.Error:' + error });
    }
}

const createUser = async (req, res, next) => {
    const errors = validationResult(req);
    console.log("Errors==" + errors);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed.',
            errors: errors.array()
        });
    }
    try {
        const { name, email, age, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ name, email, age, password: hashedPassword });
        res.status(201).json({ user, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Validation of fields failed.Error:' + error });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ users, message: 'Users retrieved successfully' });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to retrieve users' });
    }
}

const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user, message: 'User retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve user' });
    }
}

const updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user, message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user' });
    }
}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const users = await User.find({});
        res.status(200).json({ users, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
}

module.exports = { createUser, getAllUsers, getUser, updateUser, deleteUser, login, register };
