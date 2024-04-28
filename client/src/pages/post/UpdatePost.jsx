import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function UpdatePost() {
    const { id } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState({
        title: '',
        content: '',
        image: ''
    });



    useEffect(() => {
        fetchPosts();
    }, [id]);

    const fetchPosts = async () => {
        try {
            const result = await api.get(`/posts/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                });
            setUserData(result.data.post);
            // setTitle(userData.title);
            //setContent(userData.content);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };


    const handleInput = (event) => {
        const { name, value, type } = event.target;

        if (type === 'file') {
            // Handle image file input
            const file = event.target.files[0];
            setImage(event.target.files[0]);
            setUserData((prevValues) => ({
                ...prevValues,
                [name]: file
            }));
        } else {
            // Handle regular input fields
            setUserData((prevValues) => ({
                ...prevValues,
                [name]: value
            }));
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!userData.title || !userData.content) {
            setError('Please fill in all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('title', userData.title);
        formData.append('content', userData.content);
        formData.append('creator', localStorage.getItem('userId'));
        formData.append('image', image);

        api.put(`/posts/${id}`, formData, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(result => {
            toast.success("Data updated successfully");
            console.log(result)
            navigate('/post');
        }).catch(err => {
            toast.error("Error:" + err.message);
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
                            name="title"
                            placeholder='Enter title'
                            value={userData.title}
                            className='form-control'
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="content">Content</label>
                        <textarea
                            type="content"
                            name="content"
                            placeholder='Enter content'
                            value={userData.content}
                            className='form-control'
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="image">Avatar</label>
                        <input
                            type="file"
                            name="image"
                            className='form-control'
                            accept="image/*"
                            onChange={handleInput}
                        />
                    </div>

                    {image && (
                        <div>
                            <img src={URL.createObjectURL(image)} alt="Selected" width="200" />
                        </div>
                    )}

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
