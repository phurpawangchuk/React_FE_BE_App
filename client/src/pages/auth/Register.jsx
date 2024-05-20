import React, { useState } from 'react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        age: "",
        password: ""
    });

    const [error, setError] = useState('');

    const navigate = useNavigate();
    const [formValid, setFormValid] = useState(false); // State variable to track form validity

    const handleChange = e => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(form);

        if (!form.name || !form.email) {
            setError('Please fill in all fields.');
            return;
        }

        if (!validateEmail(form.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        api.post("/smartcard/register", {
            name: form.name,
            email: form.email,
            age: form.age,
            password: form.password
        })
            .then(result => {
                console.log(result.data);
                toast.success("User registered successfully");
                navigate('/auth');
            })
            .catch(err => {
                toast.error("Errors:\n" + err);
            });
    }

    // Function to validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Function to validate form
    const validateForm = () => {
        if (name && email && validateEmail(email)) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    };

    return (
        <div className="d-flex bg-body-secondary justify-content-center align-items-center min-vh-80">
            <div className="card shadow bg-white rounded col-md-4">
                <form onSubmit={handleSubmit}>
                    <h2>Register New User</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-2">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder='Enter Name'
                            className={`form-control ${!name && error ? 'is-invalid' : 'is-valid'}`}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder='Enter email'
                            className={`form-control ${(!form.email || !validateEmail(form.email)) && error ? 'is-invalid' : 'is-valid'}`}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder='Enter password'
                            autoComplete="current-password"
                            className={`form-control ${(!form.password) && error ? 'is-invalid' : 'is-valid'}`}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            name="age"
                            placeholder='Enter Age'
                            className={`form-control ${!form.age && error ? 'is-invalid' : 'is-valid'}`}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <button className='btn btn-success'>Submit</button>
                        <Link to={`/`} className='btn btn-success mx-2'>Back</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
