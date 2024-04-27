import React, { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../../context/authContext';
import PostContext from '../../context/postContext';

function Post() {

    const [posts, setPosts] = useState([])
    const [filterData, setFilterData] = useState([]);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const userLogInData = useContext(AuthContext);

    const [postDetail, setPostDetail] = useState();

    useEffect(() => {
        fetchposts();
    }, [posts]); // Empty dependency array to run the effect only once

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setFilterData(data.slice(startIndex, endIndex));
    }, [data, currentPage, itemsPerPage]);


    const fetchposts = async () => {
        try {
            await axios.get('http://localhost:3000/api/posts/', {
                headers: {
                    Authorization: 'Bearer ' + userLogInData.userToken
                }
            })
                .then((response) => {
                    setData(response.data.posts);
                    setPostDetail(response.data.posts);
                })

        } catch (error) {
            toast.error("Login to access the posts");
            console.error('Unauthorised');
        }
    };

    const Filter = ((event) => {
        setFilterData(data.filter(f => f.title.toLowerCase().includes(event.target.value)));
    });

    const handleDelete = ((id) => {
        const confirm = window.confirm("Do you want to delete?");
        if (confirm) {
            axios.delete(`http://localhost:3000/api/posts/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + userLogInData.userToken
                    }
                })
                .then((res) => {
                    setPosts(res.data.posts);
                    toast.success("Deleted successfully");
                }).catch(err => {
                    toast.error("Login to access the users");
                    console.error('Unauthorized.');
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
                    <Link to='/post/create' className='btn btn-sm btn-success '>Add +</Link>
                </div>

                <table className="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>


                    <tbody>
                        {
                            filterData.map((post) => (
                                <tr key={post._id}>
                                    <td>{post.title}</td>
                                    <td>{post.content}</td>
                                    <td>{post.imageUrl}</td>
                                    <td>
                                        <Link to={`/post/update/${post._id}`} className='btn btn-sm btn-success mx-2'>Edit</Link>
                                        <button onClick={() => handleDelete(post._id)} className='btn btn-sm btn-danger'>Delete</button>
                                        <Link to={`/post/postdetails/${post._id}`} className='btn btn-sm btn-success mx-2'>View</Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default Post