import React, { useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

function CreateUser() {
    const [name, setName] = useState('app');
    const [email, setEmail] = useState('test@cc.com');
    const [age, setAge] = useState('34');
    const [password, setPassword] = useState('12345');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const [formValid, setFormValid] = useState(false); // State variable to track form validity

    const handleNameChange = (event) => {
        setName(event.target.value);
        validateForm();
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        validateForm();
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        validateForm();
    };

    const handleAgeChange = (event) => {
        setAge(event.target.value);
        validateForm();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !age) {
            setError('Please fill in all fields.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        api.post("/users/", {
            name: name,
            email: email,
            age: age,
            password: password
        }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(result => {
                console.log(result.data);
                toast.success("Data created successfully");
                navigate('/user');
            })
            .catch(err => {
                let errorMessage = '';
                const errorMessages = err.response.data.errors;
                errorMessage = errorMessages.map(error => error.msg).join('\n');
                toast.error("Errors:\n" + errorMessage);
            });
    }

    // Function to validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Function to validate form
    const validateForm = () => {
        if (name && email && age && validateEmail(email)) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleSubmit}>
                    <h2>Add User</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-2">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder='Enter Name'
                            className={`form-control ${!name && error ? 'is-invalid' : 'is-valid'}`}
                            value={name}
                            onChange={handleNameChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder='Enter email'
                            className={`form-control ${(!email || !validateEmail(email)) && error ? 'is-invalid' : 'is-valid'}`}
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder='Enter password'
                            className={`form-control ${(!password) && error ? 'is-invalid' : 'is-valid'}`}
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            id="age"
                            placeholder='Enter Age'
                            className={`form-control ${!age && error ? 'is-invalid' : 'is-valid'}`}
                            value={age}
                            onChange={handleAgeChange}
                        />
                    </div>

                    <div className="mb-2">
                        <button className='btn btn-success'>Submit</button>
                        <Link to={`/user/`} className='btn btn-success mx-2'>Back</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUser;
