import React, { useState, useEffect } from 'react'
import api from '../../api/api';
import toast from 'react-hot-toast';

function Home() {

    const [homeText, setHomeText] = useState();
    useEffect(() => {
        fetchHomeMessage();
    }, []);

    const fetchHomeMessage = async () => {
        // console.log(api)
        try {
            const response = await api.get('/smartcard/home',
                {
                    headers: {
                        Authorization: 'Bearer ' + 'aaa'
                    }
                });
            setHomeText(response.data.instruction.details);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='container card min-vh-80 mt-4'>
            {homeText ? (
                <div className='m-4' dangerouslySetInnerHTML={{ __html: homeText }}></div>
            ) : (
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        <div className="loader"></div>
                    </div>
                )}
        </div>
    )
}

export default Home