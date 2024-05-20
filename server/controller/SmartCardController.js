const { FormatBirthDate, RegistrationNumber } = require('../util/Utilities');
const Registration = require('../model/smartcard');
const CardType = require('../model/cardtype');
const RegType = require('../model/regtype');
const HomeDetails = require('../model/home');
const Contact = require('../model/contact');
const UserRegistration = require('../model/users');
const User = require('../model/users');

const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createNewApplication = async (req, res, next) => {
    try {
        const { name, email, cid, mobile, gender, dob, location, cardTypeId, regTypeId } = req.body;

        const filename = req.file === undefined ? '' : req.file.filename;

        const card = new Registration({
            registration_number: RegistrationNumber(),
            name: name,
            email: email,
            cid: cid,
            mobile: mobile,
            gender: gender,
            dob: dob,
            location: location,
            cardTypeId: cardTypeId,
            regTypeId: regTypeId,
            filename: filename,
            action: 'Under Process',
            author: 1
        });

        // console.log(card);
        await card.save();
        res.status(200).json({ card, message: 'User registered successfully' });
    } catch (error) {
        console.log('Error registering the user:', error);
        res.status(500).json({ error, message: 'Failed to register user' });
    }
}

const getAllApplicantions = async (req, res) => {
    try {
        await Registration.findAll({})
            .then(card => {
                res.status(200).json({ card, message: 'Application retrieved successfully' });
            })
            .catch(err => {
                res.status(500).json({ message: 'Failed to retrieve Application' });
            });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve Application' });
    }
}

const getCardType = async (req, res) => {
    try {
        await CardType.findAll({}).then((cardtypes) => {
            res.status(200).json({ cardtypes, message: 'getRegistrationType retrieved successfully' });
        }).catch((error) => {
            res.status(500).json({ message: 'Application retrieved failed' });
        })
    } catch (error) {
        // console.log("errro : ", error)
        res.status(500).json({ message: 'Error--->', error });
    }
}

const getRegistrationType = async (req, res) => {
    try {
        await RegType.findAll({}).then((regtypes) => {
            res.status(200).json({ regtypes, message: 'getRegistrationType retrieved successfully' });
        }).catch((error) => {
            res.status(500).json({ message: 'Application retrieved failed' });
        })
    } catch (error) {
        // console.log("errro : ", error)
        res.status(500).json({ message: 'Error--->', error });
    }
}

const RegisterUser = async (req, res) => {
    const { name, email, password, mobile, role_id, website } = req.body;

    console.log(password);

    const hashedPassword = await bcrypt.hash(password, 12);
    // const filename = req.file === undefined ? '' : req.file.filename;
    try {
        const user = new UserRegistration({
            name,
            email,
            password: hashedPassword,
            mobile: '',
            role_id: 1,
            totalLogin: 0,
            avatar: null,
            website: 'www.test.com'
        });
        // console.log(user);
        await user.save();
        res.status(200).json({ user, message: 'User registered successfully' });
    } catch (error) {
        // console.log('Error registering the user:', error);
        res.status(500).json({ error, message: 'Failed to register user' });
    }
}

const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    let loadedUser;

    try {
        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: 'Please check username and password.' });
        }

        loadedUser = user;

        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            return res.status(401).json({ message: 'Please check username and password.' });
        }

        const accessToken = jwt.sign({ email: email, id: loadedUser.id },
            "secretkeyhere", { expiresIn: '15m' });

        const refreshToken = jwt.sign({ email: email },
            "jwt-refresh-token-secret-key", { expiresIn: '5m' });

        res.cookie('accessToken', accessToken, { maxAge: 60000 });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 300000,
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        return res.status(200).json({
            accessToken,
            refreshToken,
            username: loadedUser.name,
            userId: loadedUser.id
        });
    } catch (error) {
        return res.status(401).json({ message: 'Please check username and password.' });
    }
};


const ContactUs = async function (req, res) {
    await Contact.findOne({}).then((data) => {
        res.status(200).json({ contact: data, message: "Contact message retrieved" });
    }).catch((error) => { })
}

const HomeMessage = async function (req, res) {
    await HomeDetails.findOne({}).then((data) => {
        res.status(200).json({ instruction: data, message: "Home message retrieved" });
    }).catch((error) => { })
}

const trackApplication = async (req, res) => {
    const id = req.params.id;
    // console.log(id)
    try {
        // const card = await getApplication(id);
        await Registration.findOne({
            where: {
                registration_number: id
            },
            include: [{
                model: CardType,
                attributes: ['id', 'cardType']
            }],
            include: [{
                model: RegType,
                attributes: ['id', 'regType']
            }]
        })
            .then((card) => {
                // console.log("aa==")
                res.status(200).json({ card, message: 'Application retrieved successfully' });
            })
            .catch(err => {
                // console.log("dddd==")
                res.status(500).json({ message: 'Failed to retrieve Application : ' + err });
            });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to retrieve Application' });
    }
}

const getApplicantDetails = async (req, res) => {
    try {
        id = req.params.id;
        await Registration.findOne({
            where: { id: id },
            include: [{
                model: CardType,
                attributes: ['id', 'cardType']
            }],
            include: [{
                model: RegType,
                attributes: ['id', 'regType']
            }]
        })
            .then(card => {
                card.dob = FormatBirthDate(card.dob);
                res.status(200).json({ card, message: 'Application retrieved successfully' });
            })
            .catch(err => {
                res.status(500).json({ message: 'Failed to retrieve Application' });
            });
    } catch (error) {
        console.log("Error:", error)
        res.status(500).json({ message: 'Failed to retrieve Application' });
    }
}

const PendingApplicantions = async (req, res) => {
    const status = 'Under Process';
    try {
        const condition = 'action' ? { 'action': `${status}` } : null;
        await Registration.findAll({ limit: 100 }) // where: condition })
            .then(card => {
                res.status(200).json({ card, message: 'Application retrieved successfully' });
            })
            .catch(err => {
                res.status(500).json({ message: 'Failed to retrieve Application' });
            });
    } catch (error) {
        // console.log(error)
        res.status(500).json({ message: 'Failed to retrieve Application' });
    }
}

const updateApplication = async (req, res) => {
    const id = req.params.id;
    await Registration.update(req.body, {
        where: { id: id }
    }).then((card) => {
        // console.log(card);
        res.status(201).json({ card, message: 'Application updated successfully' });

    }).catch((err) => {
        console.log(err);
        res.status(201).json({ message: "updating issue with id=" + id });
    });
}

const deletePost = async (req, res) => {
    const id = req.params.id;
    try {
        //let post = await Post.findById(id);
        let post = await Post.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // post.published = !post.published;
        // // Save the updated post
        // post = await post.save();
        const posts = await Post.find({});

        res.status(200).json({ posts, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting Post:', error);
        res.status(500).json({ message: 'Failed to delete Post' });
    }
}

module.exports = {
    createNewApplication,
    trackApplication,
    getAllApplicantions,
    PendingApplicantions,
    getApplicantDetails,
    getRegistrationType,
    getCardType,
    HomeMessage,
    ContactUs,
    RegisterUser,
    LoginUser,
    updateApplication
};
