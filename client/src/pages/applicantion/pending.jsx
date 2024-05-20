import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../../context/authContext';
import CustomPagination from '../../util/Pagination';
import Axios from 'axios';
import api from '../../api/api'
import ApplicantPendingComponent from '../../component/ApplicantPendingComponent';

function Pending() {
    const status = 'Under Process';
    const loggedInData = useContext(AuthContext);

    // const [users, setUsers] = useState([])
    const [filterData, setFilterData] = useState([]);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const navigate = useNavigate();
    // Axios.defaults.withCredentials = true;

    const { data: fetchedData } = ApplicantPendingComponent();

    useEffect(() => {
        if (fetchedData) {
            setData(fetchedData);
        }
    }, [fetchedData]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setFilterData(data.slice(startIndex, endIndex));
    }, [data, currentPage, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const Filter = ((event) => {
        setFilterData(data.filter(f => f.name.toLowerCase().includes(event.target.value)));
    });

    const handleDelete = ((id) => {
        const confirm = window.confirm("Do you want to delete?");
        if (confirm) {
            api.delete(`/users/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + loggedInData.userToken
                    }
                })
                .then((res) => {
                    //const updatedData = res.data.users.filter(user => user.id !== id);
                    setUsers(res.data.users);
                    toast.success("Deleted successfully");
                }).catch(err => {
                    console.log("Error :" + err);
                    toast.error("Error deleting data");
                });
        }
    });

    return (
        <div className="card bg-body-secondary">
            <div className='flex-column justify-content-center align-items-center'>
                <div className='justify-content-center align-items-center'><h5>List of Pending Applications</h5></div>
                <div className='d-flex justify-content-end m-3'>
                    <input type='text'
                        className="border-1 rounded-1 ps-2 me-3"
                        placeholder='Search'
                        onFocus={(e) => e.target.value = ''}
                        onChange={Filter}
                    />
                    <Link to='/user/create' className='btn btn-sm btn-success '>Add +</Link>
                </div>
                <div className="table-responsive">
                    <table className="table table-sm table-bordered">
                        <thead>
                            <tr>
                                <th>SL#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>CardType</th>
                                <th>RegType</th>
                                <th>CID</th>
                                <th>Document</th>
                                <th>Mobile</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                filterData.map((data, index) => (
                                    <tr key={data.id}>
                                        <td>
                                            {index + 1 + (currentPage - 1) * itemsPerPage}
                                        </td>
                                        <td>{data.name}</td>
                                        <td>{data.email}</td>
                                        <td>{data.mobile}</td>
                                        <td>{data.mobile}</td>
                                        <td>{data.mobile}</td>
                                        <td>{data.mobile}</td>
                                        <td>{data.mobile}</td>
                                        <td>
                                            <Link to={`/pending/${data.id}`} className='btn btn-sm btn-success mx-2'>View Details</Link>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div>
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(data.length / itemsPerPage)}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>

    )
}

export default Pending