import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import api from '../../api/api';
import Axios from "axios";


function Login() {
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('admin@gmail.com');
    const [error, setError] = useState(null);

    const [count, setCount] = useState(0);


    /* //Closure 
    useEffect(() => {
        //const idenifier = setInterval(() => {
        setInterval(() => {
            console.log("Intercal running");
            // setCount(count + 1);
            setCount((prev) => prev + 1);
        }, 1000);

        // return () => {
        //     clearInterval(idenifier);
        // };
    }, []);

    return <p>Count: {count}</p>
    // const userData = useContext(UserContext);
*/


    Axios.defaults.withCredentials = true;

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


        api.post('/users/auth', { //this is mongoodb
            // api.post('/smartcard/auth', {
            email: email,
            password: password
        }).then((res) => {

            console.log("Response: ", res);

            //console.log("Response: ", res.data.accessToken);
            localStorage.setItem('token', res.data.accessToken)
            localStorage.setItem('refeshtoken', res.data.refreshToken)
            localStorage.setItem('userId', res.data.userId)
            localStorage.setItem('username', res.data.username);
            toast.success("Login successful");
            localStorage.setItem('timeout', false);
            navigate('/');
        }).catch((err) => {
            localStorage.setItem('timeout', true);
            // console.error("Error: ", err);
            toast.error(err.response.data.message);
        });
    };

    return (
        <div className="d-flex bg-body-secondary justify-content-center align-items-center min-vh-80">
            <div className="card-title card shadow bg-white table-responsive rounded col-md-4 m-5">
                <form onSubmit={loginHandle}>
                    <h2>Login User</h2>
                    <div className="mb-2">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="email"
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
                            autoComplete="current-password"
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