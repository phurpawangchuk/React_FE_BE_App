import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function UpdatePost() {
    const { id } = useParams();
    const [title, setTitle] = useState(' ');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, [id]);

    const fetchPosts = async () => {
        try {
            const result = await axios.get(`http://localhost:3000/api/posts/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                });
            const userData = result.data.post;
            setTitle(userData.title);
            setContent(userData.content);
            setImageUrl(userData.age);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };


    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleImageChange = (event) => {
        setImageUrl(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!title || !content) {
            setError('Please fill in all fields.');
            return;
        }
        axios.put(`http://localhost:3000/api/posts/${id}`, {
            title, content, imageUrl, creator: localStorage.getItem('userId')
        }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(result => {
                toast.success("Data updated successfully");
                console.log(result)
                navigate('/post');
            })
            .catch(err => {
                toast.error("An error occurred while updating the post");
                //  setError('An error occurred while updating the post.');
                console.log(err);
            });
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleSubmit}>
                    <h2>Update Post</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-2">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder='Enter title'
                            value={title}
                            className='form-control'
                            onChange={handleTitleChange}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="content">Content</label>
                        <textarea
                            type="content"
                            id="content"
                            placeholder='Enter content'
                            value={content}
                            className='form-control'
                            onChange={handleContentChange}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <button type="submit" className='btn btn-success'>Update</button>
                        <Link to='/post' className='btn btn-primary'>Back</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdatePost;
