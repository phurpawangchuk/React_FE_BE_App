const Post = require('../model/post');
const User = require('../model/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const createPost = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed.',
            errors: errors.array()
        });
    }

    try {
        const { title, content, imageurl, userId } = req.body;
        const post = new Post({
            title: title,
            content: content,
            imageurl: imageurl,
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
        const posts = await Post.find({});
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
        res.status(200).json({ post, message: 'Post retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve Post' });
    }
}
const updatePost = async (req, res) => {
    const id = req.params.id;
    try {
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
        console.log("UUUU===" + index, updatedPost);

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
        const post = await Post.findByIdAndDelete({ _id: id });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const posts = await Post.find({});
        res.status(200).json({ posts, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting Post:', error);
        res.status(500).json({ message: 'Failed to delete Post' });
    }
}

module.exports = { createPost, getAllPosts, getPost, updatePost, deletePost };
