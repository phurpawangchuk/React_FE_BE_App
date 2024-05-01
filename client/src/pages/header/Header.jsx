import { Link, Navigate } from 'react-router-dom'
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
        <Navbar collapseOnSelect expand="lg" className="bg-dark-subtle">
            <Container>
                <Nav.Link href="/">Home</Nav.Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
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
                    <Nav>
                        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        :
                            <Nav.Link href="/auth">Login</Nav.Link>

                        <Nav.Link href="/register">
                            Register
            </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
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