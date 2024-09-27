import { useState,useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Post from './components/Post'
import {BrowserRouter,Routes,Route,Link, Navigate} from 'react-router-dom'
import Login from './components/Login'

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:5000/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Navbar user={user}/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/post' element={user ?  <Post/>:<Navigate to="/login" />}/>
          <Route path='/login' element={user ? <Navigate to="/" /> : <Login/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
