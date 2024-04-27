import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function CreatePost() {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState({
        title: '',
        content: '',
        image: ''
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userData.title || !userData.content) {
            setError('Please fill in all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('title', userData.title);
        formData.append('content', userData.content);
        formData.append('userId', localStorage.getItem('userId'));
        formData.append('image', image);

        console.log(formData);

        axios.post("http://localhost:3000/api/posts/", formData, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(result => {
                console.log(result.data);
                toast.success("Data created successfully");
                navigate('/post');
            })
            .catch(err => {
                toast.error("Errors:\n" + err);
            });
    }

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <h2>Add Post</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-2">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder='Enter title'
                            className={`form-control ${!userData.title && error ? 'is-invalid' : 'is-valid'}`}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="content">Content</label>
                        <textarea
                            type="content"
                            name="content"
                            placeholder='Enter content'
                            className={`form-control ${(!userData.content) && error ? 'is-invalid' : 'is-valid'}`}
                            onChange={handleInput}
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
                        <button className='btn btn-success'>Submit</button>
                        <Link to={`/post/`} className='btn btn-success mx-2'>Back</Link>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
