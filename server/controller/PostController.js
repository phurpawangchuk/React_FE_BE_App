const Post = require('../model/post');
const User = require('../model/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const createPost = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed.',
            errors: errors.array()
        });
    }

    try {
        const { title, content, image, userId } = req.body;
        const post = new Post({
            title: title,
            content: content,
            image: req.file.filename,
            creator: userId
        });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await post.save();
        user.posts.push(post);
        await user.save();

        res.status(201).json({ post, message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post' });
    }
}


const getAllPosts = async (req, res) => {
    try {
        // const posts = await Post.find({ published: true }).populate('creator');;
        const posts = await Post.find({}).populate('creator');;
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

        // Find the post by its ID and update its fields
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // If the post is successfully updated, you might want to update the corresponding user's posts array
        // Assuming each post has a creator field containing the user's ID
        const userId = updatedPost.creator;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's posts array to reflect the changes
        const index = user.posts.findIndex(post => post._id === id);

        if (index !== -1) {
            user.posts[index] = updatedPost;
        } else {
            user.posts.push(updatedPost);
        }
        await user.save();

        res.status(200).json({ updatedPost, message: 'Post updated successfully' });
    } catch (error) {
        console.error('Failed to update post:', error);
        res.status(500).json({ message: 'Failed to update post' });
    }
}

const deletePost = async (req, res) => {
    const id = req.params.id;
    try {
        let post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.published = !post.published;
        // Save the updated post
        post = await post.save();
        const posts = await Post.find({});

        res.status(200).json({ posts, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting Post:', error);
        res.status(500).json({ message: 'Failed to delete Post' });
    }
}

module.exports = { createPost, getAllPosts, getPost, updatePost, deletePost };
