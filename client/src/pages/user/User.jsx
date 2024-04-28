import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AuthContext from '../../context/authContext';
import CustomPagination from '../../util/Pagination';

function User() {

    const loggedInData = useContext(AuthContext);

    const [users, setUsers] = useState([])
    const [filterData, setFilterData] = useState([]);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);

    useEffect(() => {
        fetchUsers();
    }, [users]); // Empty dependency array to run the effect only once

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setFilterData(data.slice(startIndex, endIndex));
    }, [data, currentPage, itemsPerPage]);


    const fetchUsers = async () => {
        try {
            const response = await api.get('/users/', {
                headers: {
                    Authorization: 'Bearer ' + loggedInData.userToken
                }
            });
            setData(response.data.users);
        } catch (error) {
            toast.error("Login to access the users");
            console.error('Unauthorized.');
        }
    };


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
        <div className="table-bordered">
            <div className='flex-column justify-content-center align-items-center'>
                <div className='d-flex justify-content-end m-3'>
                    <input type='text'
                        className="border-1 rounded-1 ps-2 me-3"
                        placeholder='Search'
                        onFocus={(e) => e.target.value = ''}
                        onChange={Filter}
                    />
                    <Link to='/user/create' className='btn btn-sm btn-success '>Add +</Link>
                </div>

                <table className="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            filterData.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.age}</td>
                                    <td>
                                        <Link to={`/user/update/${user._id}`} className='btn btn-sm btn-success mx-2'>Edit</Link>
                                        <button onClick={(e) => handleDelete(user._id)} className='btn btn-sm btn-danger'>Delete</button>

                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

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

export default User