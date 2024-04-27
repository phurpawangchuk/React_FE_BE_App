import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function CreatePost() {
    const [title, setTitle] = useState('app');
    const [content, setContent] = useState('test@cc.com');
    const [imageUrl, setImageUrl] = useState('34');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        validateForm();
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
        validateForm();
    };

    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value);
        validateForm();
    };

    const validateForm = () => {
        if (title && content) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !content) {
            setError('Please fill in all fields.');
            return;
        }

        axios.post("http://localhost:3000/api/posts/", {
            title: title,
            content: content,
            imageUrl: '',
            userId: localStorage.getItem('userId')
        }, {
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
                <form onSubmit={handleSubmit}>
                    <h2>Add Post</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-2">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder='Enter title'
                            className={`form-control ${!title && error ? 'is-invalid' : 'is-valid'}`}
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="content">Content</label>
                        <textarea
                            type="content"
                            id="content"
                            placeholder='Enter content'
                            className={`form-control ${(!content) && error ? 'is-invalid' : 'is-valid'}`}
                            value={content}
                            onChange={handleContentChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="age">Imagee</label>
                        <input
                            type="file"
                            id="image"
                            placeholder='Enter image'
                            onChange={handleImageUrlChange}
                        />
                    </div>

                    <div className="mb-2">
                        <button className='btn btn-success'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
