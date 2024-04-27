const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PostSchema = Schema(
    {
        title: {
            type: String,
            required: [true, "Please enter title"]
        },
        content: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        published: {
            type: Boolean,
            default: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamp: true
    }
);

const Post = mongoose.model("Post", PostSchema)
module.exports = Post