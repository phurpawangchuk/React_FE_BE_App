import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import api from '../../api/axios';

function Login() {
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState(null);

    // const userData = useContext(UserContext);

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setError(null); // Clear error when user types in password
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setError(null); // Clear error when user types in email
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const navigate = useNavigate();

    const loginHandle = (event) => {
        event.preventDefault(); // Prevent default form submission
        if (!email || !password || !validateEmail(email)) {
            setError('Please enter a valid email and password.');
            return;
        }

        // Proceed with login
        api.post('/users/auth', {
            email: email,
            password: password
        })
            .then((res) => {
                console.log("Response: ", res.data.token);
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('userId', res.data.userId)
                localStorage.setItem('username', res.data.username);
                toast.success("Login successful");
                window.location.reload(); // Reload the page
                window.location.href = '/user'; // Redirect to the home page
            })
            .catch(err => {
                console.error("Error: ", err);
                toast.error("Error: Unable to login");
            });
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="bg-white table-responsive rounded p-3">
                <form onSubmit={loginHandle}>
                    <h2>Login User</h2>
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
                        {(!email || !validateEmail(email)) && error && (
                            <div className="invalid-feedback">Please enter a valid email.</div>
                        )}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder='Enter password'
                            className={`form-control ${!password && error ? 'is-invalid' : 'is-valid'}`}
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        {!password && error && (
                            <div className="invalid-feedback">Please enter a password.</div>
                        )}
                    </div>

                    <div className="mb-2">
                        <button className='btn btn-success'>Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;