import { Link, Navigate, NavLink } from 'react-router-dom'
import './Header.css'
import { useContext } from 'react'
import AuthContext from '../../context/authContext'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import toast from 'react-hot-toast';

function Header() {

    const timeout = localStorage.getItem('timeout');
    const handleLogout = ((event) => {
        event.preventDefault();
        toast.success("Logout successful");
        localStorage.clear();
        window.location.reload();
    });

    return (
        <Navbar collapseOnSelect expand="lg" className="nav min-vh-20">
            <Container>
                {/* <Nav.Link href="/" className="link">Pending</Nav.Link>
                <Nav.Link href="/" className="link">Approved</Nav.Link>
                <Nav.Link href="/" className="link">Rejected</Nav.Link> */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" className='bg-light border-light' />
                <Navbar.Collapse className='bg-light justify-content-center align-items-center' id="responsive-navbar-nav">
                    {/* <Nav className="me-auto">
                        <Nav.Link href="/user">User</Nav.Link>
                        <Nav.Link href="/post">Post</Nav.Link>
                        <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                                </NavDropdown.Item>
                        </NavDropdown>
                    </Nav> 
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                    :
                            <Nav.Link href="/auth">Login</Nav.Link>

                    <Nav.Link href="/register">
                        Register
                        </Nav.Link>
*/}
                    <Nav className="nav col-12">
                        <div className='btn btn-success btn-sm m-1'>
                            <Nav.Link href="/" className="link"> Home </Nav.Link>
                        </div>

                        <div className='btn btn-success btn-sm m-1'>
                            <Nav.Link href="./pending" className="link"> Pending </Nav.Link>
                        </div>
                        <div className='btn btn-success btn-sm m-1'>
                            <Nav.Link href="/" className="link"> Approved </Nav.Link>
                        </div>
                        <div className='btn btn-success btn-sm m-1'>
                            <Nav.Link href="/" className="link"> Rejected </Nav.Link>
                        </div>

                        <div className='btn btn-success btn-sm m-1'>
                            <Nav.Link href="/contact" className="link"> Contact Us </Nav.Link>
                        </div>

                        <div className='btn btn-success btn-sm m-1'>
                            <Nav.Link href="/track" className="link"> Track Application </Nav.Link>
                        </div>

                        <div className='btn btn-success btn-sm m-1'>
                            <Nav.Link href="/application" className="link"> Online Registeration </Nav.Link>
                        </div>

                        <Nav.Link onClick={handleLogout} className="link">Logout</Nav.Link>
                        :
                            <Nav.Link className="link" href="./auth">Login</Nav.Link>

                        <Nav.Link className="link" href="/register">
                            Register
                        </Nav.Link>

                        <Nav.Link className="link" href="/post">
                            Post
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container >
        </Navbar >
    );
}

export default Header;

// function Header() {
//     const loggedData = useContext(AuthContext);
//     // const imageUrl = "http://localhost:9090/uploads/" + loggedData.userImage;

//     const handleLogout = ((event) => {
//         event.preventDefault();
//         localStorage.clear();
//         window.location.reload();
//     });

//     return (
//         <nav className='nav'>
//             {localStorage.getItem('username') != undefined && (
//                 <p className=''>Welcome {localStorage.getItem('username')}</p>
//             )}
//             <ul>

//                 <li className='link'><Link to='/' className='link'
//                     data-bs-toggle="tooltip" data-bs-placement="bottom" title="Home">Home</Link></li>
//                 <li className='link'><Link to='/' className='link'> About</Link></li>
//                 <li className='link'><Link to='/user' className='link'> User</Link></li>
//                 <li className='link'><Link to='/post' className='link'> Post</Link></li>
//                 {localStorage.getItem('token') !== null ?
//                     <li className='link' onClick={handleLogout}>Logout</li>
//                     :
//                     <li className='link'><Link to='/auth' className='link'> Login</Link></li>
//                 }
//             </ul>
//         </nav>
//     )
// }

// export default Header;