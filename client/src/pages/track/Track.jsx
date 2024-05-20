import React, { useState, useEffect } from 'react'
import api from '../../api/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function Track() {
    const [track, setTrack] = useState('');
    const [error, setError] = useState('');
    const [data, setData] = useState('');
    const [dataFound, setDataFound] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const handleInput = (event) => {
        setTrack(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!track) {
            setError('Please provide application ID.');
            return;
        }
        setShowLoading(true);
        fetchApplication();
    }

    const fetchApplication = async () => {
        // const url = 'http://localhost/smartcard_backend/public/api/smartcard/' + track;
        try {
            // const response = await api.get(url,
            const response = await api.get(`/smartcard/${track}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + 'aaa'
                    }
                });
            console.log(response.data);
            if (response.data.card.length == 0) {
                setDataFound(false);
                setShowLoading(false);
                setData('Not Found');
            } else {
                setDataFound(true);
                setShowLoading(false);
                setData(response.data.card.action);
            }
        } catch (error) {
            toast.error("No record found.Try again!");
            setShowLoading(false);
        }
    };

    return (
        <div className="d-flex min-vh-80 justify-content-center align-items-center">
            <div className="card shadow bg-white rounded col-md-6">
                <form onSubmit={handleSubmit}>
                    <h5>Track Application</h5>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-2">
                        <input
                            type="text"
                            name="track"
                            id="track"
                            placeholder='Enter application Id'
                            className={`form-control ${!track && error ? 'is-invalid' : 'is-valid'}`}
                            onChange={handleInput}
                        />
                    </div>
                    <div className="mb-2">
                        <button className='btn btn-success mt-2'>Submit</button>
                        <Link to={`/home`} className='btn btn-success mx-2'>Back</Link>
                    </div>
                    {dataFound && data === 'Approved' ? (
                        <div>
                            Your application is <b>{data}</b>. Collect from the office during the working day.
                            </div>
                    ) : data === 'Under Process' ? (
                        <div>
                            Your application is <b>{data}</b>. Please wait for further updates.
                            </div>
                    ) : data === 'Rejected' ? (
                        <div>
                            Your application has been <b>{data}</b>. Please contact the office for more information.
                            </div>
                    ) : data == 'Not Found' && (
                        <div className="danger color-red">
                            <i className="fas fa-exclamation-triangle icon"></i>
                            Application ID does not match. Please try again!
                        </div>
                    )}

                    {showLoading && (
                        <div className="loader"></div>
                    )}

                    {/* {!dataFound && (
                        <div class="danger color-red">
                            <i class="fas fa-exclamation-triangle icon"></i>
                            Application ID does not match. Please try again!
                        </div>
                    )} */}

                </form>
            </div>
        </div>
    )
}

export default Track