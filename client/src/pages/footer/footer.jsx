import React, { useState, useEffect } from 'react'
import api from '../../api/api';

function Footer() {
    const [contact, setContact] = useState();
    useEffect(() => {
        // fetchContactDetails();
    }, []);

    const fetchContactDetails = async () => {
        try {
            const response = await api.get('/smartcard/contact',
                {
                    headers: {
                        Authorization: 'Bearer ' + 'aaa'
                    }
                });
            setContact(response.data.contact);
        } catch (error) {
            console.log("error===", error);
        }
    };
    return (
        <div className='footer'>
            <div className='footer-item'>
                {/* {contact.phone} */}
            </div>
            <div className='footer-item'>
                {/* {contact.website} */}
            </div>
        </div>
    )
}

export default Footer