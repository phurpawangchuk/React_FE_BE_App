const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter name"]
        },
        email: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true,
            default: 0
        },
        password: {
            type: String,
            required: true
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            }
        ]
        // image: {
        //     type: String,
        //     required: false
        // },
    },
    {
        timestamp: true
    }
);

const User = mongoose.model("User", UserSchema)
module.exports = User