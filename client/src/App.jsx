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

function App() {

  const [userToken, setUserToken] = useState(localStorage.getItem('token'));

  return (
    <div>
      <AuthContext.Provider value={{ userToken, setUserToken }}>
        <BrowserRouter>
          <Header />
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/auth" element={<Login />} />

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
        </BrowserRouter>
      </AuthContext.Provider>

    </div>

  )
}

export default App