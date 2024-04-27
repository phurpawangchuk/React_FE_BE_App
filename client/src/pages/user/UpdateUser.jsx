import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function UpdateUser() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await axios.get(`http://localhost:3000/api/users/${id}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    });
                const userData = result.data.user;
                setName(userData.name);
                setEmail(userData.email);
                setAge(userData.age);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();

    }, [id]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleAgeChange = (event) => {
        setAge(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!name || !email || !age) {
            setError('Please fill in all fields.');
            return;
        }
        axios.put(`http://localhost:3000/api/users/${id}`, {
            name, email, age
        }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(result => {
                toast.success("Data updated successfully");
                console.log(result)
                navigate('/user');
            })
            .catch(err => {
                toast.success("An error occurred while updating the user");
                setError('An error occurred while updating the user.');
                console.log(err);
            });
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleSubmit}>
                    <h2>Update User</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-2">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder='Enter Name'
                            value={name}
                            className='form-control'
                            onChange={handleNameChange}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder='Enter email'
                            value={email}
                            className='form-control'
                            onChange={handleEmailChange}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            id="age"
                            placeholder='Enter Age'
                            value={age}
                            className='form-control'
                            onChange={handleAgeChange}
                            required
                            min="18"
                        />
                    </div>

                    <div className="mb-2">
                        <button type="submit" className='btn btn-success'>Update</button>
                        <Link to='/user' className='btn btn-primary'>Back</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateUser;
