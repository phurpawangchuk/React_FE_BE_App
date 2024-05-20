import React, { useState, useEffect } from 'react'
import api from '../../api/api';
import toast from 'react-hot-toast';
import contactComponent from '../../component/contactComponent';

function Contact() {

    const { data: fetchedData } = contactComponent();

    const [data, setData] = useState();

    useEffect(() => {
        if (fetchedData) {
            setData(fetchedData);
        }
    }, [fetchedData]);


    return (
        <div className='container card min-vh-50 mt-4 align-items-center col-8'>
            <h4>Contact us at the following details</h4>
            {data ? (
                <>
                    <div className='m-1'>{data.phone}</div>
                    <div className='m-1' dangerouslySetInnerHTML={{ __html: data.address }}></div>
                    <div className='m-1'>{data.website}</div>

                </>
            ) : (
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        <div className="loader"></div>
                    </div>
                )}
        </div>
    )
}

export default Contact