import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../../context/authContext';
import api from '../../api/axios';

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
            const response = await api.get('/posts/', {
                headers: {
                    Authorization: 'Bearer ' + userLogInData.userToken
                }
            });
            console.log(response.data.posts);
            setData(response.data.posts);
            setPostDetail(response.data.posts);
        } catch (error) {
            toast.error("Login to access the posts");
            console.error('Unauthorised');
        }
    };

    const Filter = ((event) => {
        setFilterData(data.filter(f => f.title.toLowerCase().includes(event.target.value)));
    });
    const handleDelete = (id) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return;
        }

        const confirmDeletion = window.confirm("Do you want to delete?");
        if (!confirmDeletion) {
            return;
        }

        api.delete(`/posts/${id}`, {
            headers: {
                Authorization: 'Bearer ' + userLogInData.userToken
            }
        })
            .then((res) => {
                if (res.data && res.data.posts) {
                    setPosts(res.data.posts);
                    toast.success("Deleted successfully");
                } else {
                    console.error('Unexpected response format:', res.data);
                    toast.error("Failed to delete post. Unexpected response format.");
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    toast.error("Unauthorized access.");
                } else {
                    toast.error("Failed to delete post. Please try again later.");
                }
                console.error('Error deleting post:', err);
            });
    };

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
                            <th>Creator</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            filterData.map((post) => (
                                <tr key={post._id}>
                                    <td>{post.title}</td>
                                    <td>{post.content}</td>
                                    <td>
                                        {post.image && <img src={`http://localhost:3000/public/uploads/${post.image}`} width='100px' alt="Post Image" />}
                                    </td>
                                    <td>{post.creator ? post.creator.name : ''}</td>
                                    <td>
                                        {post.creator._id !== localStorage.getItem('userId') ? (
                                            <>
                                                <button disabled className='btn btn-sm btn-success mx-2'>Edit</button>
                                                <button onClick={() => handleDelete(post._id)} disabled className='btn btn-sm btn-danger'>Delete</button>
                                            </>
                                        ) : (
                                                <>
                                                    <Link to={`/post/update/${post._id}`} className='btn btn-sm btn-success'>Edit</Link>
                                                    <button onClick={() => handleDelete(post._id)} className='btn btn-sm btn-info mx-2'>Toggle</button>
                                                    <button onClick={() => handleDelete(post._id)} className='btn btn-sm btn-danger'>Delete</button>
                                                </>
                                            )}

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