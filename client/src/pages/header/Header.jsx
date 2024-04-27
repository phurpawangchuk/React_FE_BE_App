import { Link, Navigate } from 'react-router-dom'
import './Header.css'
import { useContext } from 'react'
import AuthContext from '../../context/authContext'

function Header() {
    const loggedData = useContext(AuthContext);
    // const imageUrl = "http://localhost:9090/uploads/" + loggedData.userImage;

    const handleLogout = ((event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.reload();
    });

    return (
        <nav className='nav'>
            <p className=''>Welcome Me</p>
            <ul>

                <li className='link'><Link to='/' className='link'
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Home">Home</Link></li>
                <li className='link'><Link to='/' className='link'> About</Link></li>
                <li className='link'><Link to='/user' className='link'> User</Link></li>
                <li className='link'><Link to='/post' className='link'> Post</Link></li>
                {localStorage.getItem('token') !== null ?
                    <li className='link' onClick={handleLogout}>Logout</li>
                    :
                    <li className='link'><Link to='/auth' className='link'> Login</Link></li>
                }
            </ul>
        </nav>
    )
}

export default Header;