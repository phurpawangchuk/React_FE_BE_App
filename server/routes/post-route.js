const express = require('express')
const router = express.Router();
const { createPost, getAllPosts, getPost, updatePost, deletePost } = require('../controller/PostController')
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');

router.post('/', isAuth, [
    body('title').trim().isLength({ min: 5 })
        .withMessage('Title field must be minimum of 5 characters'),
    body('content').trim().isLength({ min: 5 })
        .withMessage('Content must be between 5 to 100 characters.'),
], createPost);


router.get('/', isAuth, getAllPosts);
router.get('/:id', isAuth, getPost);
router.put('/:id', isAuth, updatePost);
router.delete('/:id', isAuth, deletePost);

module.exports = router;

