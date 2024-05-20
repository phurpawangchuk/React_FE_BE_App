const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');
const {
    createNewApplication,
    trackApplication,
    PendingApplicantions,
    getApplicantDetails,
    getAllApplicantions,
    getRegistrationType,
    getCardType,
    ContactUs,
    HomeMessage,
    RegisterUser,
    LoginUser,
    updateApplication } = require('../controller/SmartCardController');

// Define routes
router.post('/', [
    body('name').trim().isLength({ min: 5 }).withMessage('Name field must be minimum of 5 characters'),
    body('location').trim().isLength({ min: 5, max: 100 }).withMessage('Address must be between 5 to 100 characters.'),
], createNewApplication);

router.get('/contact', ContactUs);
router.get('/home', HomeMessage);
router.get('/getRegType', getRegistrationType);
router.get('/getCardType', getCardType);
router.get('/pending', PendingApplicantions);
router.get('/pending/:id', getApplicantDetails);
router.get('/:id', trackApplication);
router.get('/', isAuth, getAllApplicantions);
router.put('/:id', updateApplication);

//user
router.post('/register', RegisterUser);
//auth
router.post('/auth', LoginUser);


module.exports = router;
