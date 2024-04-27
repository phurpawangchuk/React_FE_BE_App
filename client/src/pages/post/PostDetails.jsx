import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';
import AuthContext from '../../context/authContext';
import { Link } from 'react-router-dom';

function PostDetails() {
    const [post, setPost] = useState(null);
    const { postId } = useParams(); //postId should match in the App.jsx

    const loggedInData = useContext(AuthContext);

    useEffect(() => {
        if (postId) {
            fetchPost(postId);
        }
    }, [postId]); // Fetch post whenever postId changes

    const fetchPost = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/posts/${postId}`, {
                headers: {
                    Authorization: 'Bearer ' + loggedInData.userToken
                }
            });
            setPost(response.data.post); // Assuming the response data contains a single post object
        } catch (error) {
            toast.error("Login to access the users");
            console.error('Unauthorized.');
        }
    };

    return (
        <div className="table-bordered">
            <div className='flex-column justify-content-center align-items-center'>
                {post ? (
                    <>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <img src={post.imageUrl} alt="Post Image" />
                    </>
                ) : (
                        <p>Loading...</p>
                    )}
            </div>
            <Link to={`/post/`} className='btn btn-sm btn-success my-3 mx-2'>Back</Link>

        </div>
    );
}

export default PostDetails;
