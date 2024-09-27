import { useState, useCallback, useEffect } from 'react';
import Home from './components/Home/Home';
import {Route,Routes} from 'react-router-dom'
import Layout from './Layout.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import Login from './components/Login/Login.jsx'
import Signup from './components/Signup/Signup.jsx'
import EmailVerify from './components/EmailVerify/EmailVerify.jsx'
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ProtectedRoute({ element, user }) {
  const [showBlur, setShowBlur] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => { 
      if (!user) {
          setShowBlur(true);
          toast.warning("Please log in First!", {
              position: "bottom-center",
              autoClose: 1000,
              hideProgressBar: true,
              style : {
                backgroundColor : '#121212',
                color : 'white'
              }
          });

          setTimeout(() => {
              navigate('/signIn');
          }, 1000); 
      }
  }, [user, navigate]);

  return user ? element : (
      // Apply the blur immediately
      <div style={{ filter: showBlur ? 'blur(10px)' : 'none', pointerEvents: showBlur ? 'none' : 'auto' }}>
          {element}
      </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const userLogged = location.state?.userLogged;

  useEffect(() => {
      const getUser = () => {
          axios
              .get("http://localhost:7000/api/v1/users/getCurrentUser", { withCredentials: true })
              .then((response) => {
                  setUser(response.data);
              })
              .catch((err) => {
                  console.log(err);
              });
      };
      getUser();
  }, [userLogged]); // Only refetch when userLogged changes

  return (
      <div>
          <Routes>
              <Route path='/' element={<Layout user={user} setUser={setUser} />}>
                  <Route path='' element={<Home user={user} />} />
                  <Route path='about' element={<ProtectedRoute user={user} element={<About />} />} />
                  <Route path='contact' element={<ProtectedRoute user={user} element={<Contact />} />} />
              </Route>
              <Route path='/signIn' element={<Login />} />
              <Route path='/signUp' element={<Signup />} />
              <Route path='/users/:id/verify/:token' element={<EmailVerify />} />
          </Routes>
          <ToastContainer />
      </div>
  );
}

export default App;
