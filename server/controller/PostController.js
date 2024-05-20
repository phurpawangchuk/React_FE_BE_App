const Post = require('../model/post');
const User = require('../model/user');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

const createPost = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(422).json({
            message: 'Validation failed.',
            errors: errorMessages
        });
    }

    try {
        const { title, content, userId } = req.body;
        let attachmentFile = null;
        console.log(req.file.filename)

        if (req.file != null) {
            attachmentFile = req.file.filename
        }
        const post = new Post({
            title: title,
            content: content,
            image: attachmentFile,
            creator: userId
        });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        await post.save();
        return res.status(201).json({ post, message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(401).json({ message: 'Failed to create post' });
    }
}

const getAllPosts = async (req, res) => {
    try {
        // const posts = await Post.find({ published: true }).populate('creator');;
        // const posts = await Post.find({}).populate('creator');
        // const posts = await Post.find({});
        const posts = await Post.find({}).populate('creator', 'name email age');

        res.status(200).json({ posts, message: 'Posts retrieved successfully' });
    } catch (error) {
        console.error('Error fetching Posts:', error);
        res.status(500).json({ message: 'Failed to retrieve Posts' });
    }
}

const getPost = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const creator = await User.findById(post.creator);
        res.status(200).json({ post, creator, message: 'Post retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve Post' });
    }
}

const updatePost = async (req, res) => {
    const id = req.params.id;
    try {
        //validate creator and requested userId
        const post = await Post.findById({ _id: id });
        if (post.creator != req.body.creator) {
            return res.status(401).json({
                message: 'Post do not belong to you.'
            })
        }
        if (req.file) {
            if (fs.existsSync(path.join('public/uploads', post.image))) {
                fs.unlinkSync(path.join('public/uploads', post.image));
            }
            post.image = req.file.filename;
        }

        post.title = req.body.title;
        post.content = req.body.content;
        post.creator = req.body.creator;

        // Save the updated post
        const updatedPost = await post.save();
        res.status(200).json({ updatedPost, message: 'Post updated successfully' });
    } catch (error) {
        console.error('Failed to update post:', error);
        res.status(500).json({ message: 'Failed to update post' });
    }
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

module.exports = { createPost, getAllPosts, getPost, updatePost, deletePost };
