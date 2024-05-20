import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import CreateUser from './pages/user/CreateUser';
import UpdateUser from './pages/user/UpdateUser';
import User from './pages/user/User';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Header from './pages/header/Header';
import Post from './pages/post/Post';
import Postdetails from './pages/post/PostDetails';
import CreatePost from './pages/post/CreatePost';
import UpdatePost from './pages/post/UpdatePost';
import AuthContext from './context/authContext';
import Home from './pages/home/Home';
import Register from './pages/auth/Register';
import Footer from './pages/footer/footer';
import Contact from './pages/contact/contact';
import Track from './pages/track/Track';
import OnlineApplication from './pages/applicantion/application';
import Pending from './pages/applicantion/pending';
import ApplicationDetails from './pages/applicantion/details';

function App() {

  const [userToken, setUserToken] = useState(localStorage.getItem('token'));

  return (
    <div className="bg-color">
      <AuthContext.Provider value={{ userToken, setUserToken }}>
        <BrowserRouter>
          <Header />
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/track' element={<Track />} />
            <Route path='/application' element={<OnlineApplication />} />
            <Route path='/pending' element={<Pending />} />
            <Route path='/pending/:id' element={<ApplicationDetails />} />

            <Route path="/auth" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path='/user' element={<User />} />
            <Route path='/user/create' element={<CreateUser />} />
            <Route path='/user/update' element={<UpdateUser />} />
            <Route path="/user/update/:id" element={<UpdateUser />} />

            <Route path='/post' element={<Post />} />
            <Route path='/post/create' element={<CreatePost />} />
            <Route path='/post/update' element={<UpdatePost />} />
            <Route path="/post/update/:id" element={<UpdatePost />} />
            <Route path="/post/postdetails/:postId" element={<Postdetails />} />

          </Routes>
          <Toaster />
          <Footer />
        </BrowserRouter>
      </AuthContext.Provider>

    </div>

  )
}

export default App