import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

function OnlineApplication() {
    // const [name, setName] = useState('app');
    const [uploadFile, setUploadFile] = useState(null);
    // const [email, setEmail] = useState('test@cc.com');
    // const [password, setPassword] = useState('12345');
    const [error, setError] = useState('');
    const [registrationType, setRegistrationType] = useState([]);
    const [cardType, setCardType] = useState([]);
    const [userData, setUserData] = useState({
        name: '',
        gender: '',
        email: '',
        cid: '',
        mobile: '',
        dob: '',
        cardType: '',
        registrationType: '',
        address: ''
    });

    const navigate = useNavigate();
    const [formValid, setFormValid] = useState(false); // State variable to track form validity

    useEffect(() => {
        getRegistrationType();
        getCardType();
    }, []);

    const getRegistrationType = async () => {
        try {
            const response = await api.get('/smartcard/getRegType',
                {
                    headers: {
                        Authorization: 'Bearer ' + 'userLogInData.userToken'
                    }
                });
            // console.log("dddd222===", response.data.regtypes);
            setRegistrationType(response.data.regtypes);
        } catch (error) {
            console.error('Error..', error);
        }
    };


    const getCardType = async () => {
        try {
            const response = await api.get('/smartcard/getCardType',
                {
                    headers: {
                        Authorization: 'Bearer ' + 'userLogInData.userToken'
                    }
                });
            setCardType(response.data.cardtypes);
        } catch (error) {
            console.error('Error..', error);
        }
    };


    const handleInput = (event) => {
        const { name, value, type } = event.target;

        if (type === 'file') {
            // Handle image file input
            const file = event.target.files[0];
            setUploadFile(event.target.files[0]);
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
            // validateForm();
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (userData.name == '' || userData.cardType == '' || userData.registrationType == '') {
            setError('Please fill in all fields.');
            return;
        }

        if (!validateEmail(userData.email)) {
            setError('Please enter a valid email address.');
            return;
        }
        // if (uploadFile == null) {
        //     setUploadFile();
        // }
        console.log(uploadFile);

        const formData = new FormData();
        formData.append('filename', uploadFile);
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('cid', userData.cid);
        formData.append('mobile', userData.mobile);
        formData.append('gender', userData.gender);
        formData.append('dob', userData.dob);
        formData.append('location', userData.address);
        formData.append('cardTypeId', userData.cardType);
        formData.append('regTypeId', userData.registrationType);
        formData.append('status', '');
        formData.append('remarks', '');

        api.post("/smartcard/", formData, {
            // api.post("http://localhost/smartcard_backend/public/api/smartcard/register", formData, {
            headers: {
                //'Content-Type': 'application/json',
                Authorization: 'Bearer ' + 'localStorage.getItem()'
            }
        }).then(result => {
            console.log(result.data);
            toast.success("Application submitted successfully");
            navigate('/track');
        }).catch(err => {
            console.log("Error ---", err);
            if (err.response && err.response.data && err.response.data.errors) {
                const errorMessages = err.response.data.errors.map((error, index) => (
                    <div key={index}>
                        {error}
                    </div>
                ));
                toast.error(
                    <div>
                        {errorMessages}
                    </div>
                );

            } else {
                toast.error("An error occurred. Please try again later.");
            }
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
        <div className="d-flex container mt-3 justify-content-center align-items-center min-vh-80">
            <div className="card shadow bg-white rounded col-md-8">
                <form onSubmit={handleSubmit}>
                    <h4>Online Application</h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-2">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder='Enter Name'
                            className={`form-control ${!userData.name && error ? 'is-invalid' : 'is-valid'}`}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="gender">Gender</label>
                        <select
                            name='gender'
                            onChange={handleInput}
                            className={`form-control ${(!userData.gender) && error ? 'is-invalid' : 'is-valid'}`}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    {/* <div className="mb-2">
                        <label htmlFor="email">Card Type</label>
                        <select
                            className={`form-control ${(!cardType) && error ? 'is-invalid' : 'is-valid'}`}
                            value={cardType}
                            onChange={handleCardTypeChange}
                        >
                            <option value={cardType}>Select Card Type</option>
                            {
                                cardType.length() > 0 && (
                                    cardType.map((data, index) => (
                                        <option key={index} value={data.cardType}>{data.cardType}</option>
                                    )))}
                        </select>
                    </div> */}

                    <div className="mb-2">
                        <label htmlFor="cid">CID/Student Number</label>
                        <input
                            type="text"
                            name="cid"
                            placeholder='Enter cid/student number'
                            className={`form-control is-valid`}
                            value={userData.cid}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="mobile">Mobile Number</label>
                        <input
                            type="text"
                            name="mobile"
                            placeholder='Enter mobile'
                            className={`form-control ${(!userData.mobile) && error ? 'is-invalid' : 'is-valid'}`}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            placeholder='Enter Birth Date'
                            className={`form-control ${(!userData.dob) && error ? 'is-invalid' : 'is-valid'}`}
                            name="dob"
                            onChange={handleInput}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="address">Current Address</label>
                        <textarea
                            type="text"
                            name="address"
                            placeholder='Thimphu, Changzamtog'
                            className={`form-control ${(!userData.address) && error ? 'is-invalid' : 'is-valid'}`}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="email">Registration Type</label>
                        <select
                            onChange={handleInput}
                            name='registrationType'
                            className={`form-control ${(!userData.registrationType) && error ? 'is-invalid' : 'is-valid'}`}
                        >
                            {registrationType.map((data) => {
                                return <option key={data.id} value={data.id}>{data.regType}</option>;
                            })}

                        </select>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="cardType">Card Type</label>
                        <select
                            onChange={handleInput}
                            name='cardType'
                            className={`form-control ${(!userData.cardType) && error ? 'is-invalid' : 'is-valid'}`}
                        >
                            {cardType.map((data) => {
                                return <option key={data.id} value={data.id}>{data.cardType}</option>;
                            })}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder='Enter email'
                            className={`form-control is-valid`}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="uploadFile">Document</label>
                        <input
                            type="file"
                            name='uploadFile'
                            placeholder='Enter password'
                            className={`form-control is-valid`}
                            onChange={handleInput}
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

export default OnlineApplication;
