import React,{useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {

  console.log('Component Rendered')

  const [avatar, setAvatar] = useState();
  const [coverImage, setCoverImage] = useState();
  const [username,setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const registerUser = () => {

    if(!username){
      toast.error("Please fill All the values!");
      return;
    }

    if(!email){
      toast.error("Please fill All the values!");
      return;
    }

    if(!fullName){
      toast.error("Please fill All the values!");
      return;
    }

    if(!password){
      toast.error("Please fill All the values!");
      return;
    }

    if(!avatar){
      console.log("No file is selected in Avatar Field");
      toast.error("Please select a file!");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.append('username',username);
    fd.append('fullName',fullName);
    fd.append('email',email);
    fd.append('password',password);
    fd.append('avatar',avatar);
    if(coverImage){
      fd.append('coverImage',coverImage);
    }
    
    axios.post('http://localhost:7000/api/v1/users/register',fd)
    .then(function (response) {
      setLoading(false);
      toast.success("User registered successfully!",{
        autoClose: 3000,
        hideProgressBar: true,
        position : 'bottom-center',
        style : {
          backgroundColor : '#121212',
          color : 'white'
        }
      })
      setTimeout(()=>{
        navigate('/signIn')
      },2000)
    })
    .catch(function (error) {
      setLoading(false);

      let errorMessage = 'Registration failed!';  

      if (error.response) {
          const contentType = error.response.headers['content-type'];

          if (contentType && contentType.includes('application/json')) {
              errorMessage = `Registration failed! ${error.response.data.message}`;
          } 
          
          else if (contentType && contentType.includes('text/html')) {
              const htmlData = error.response.data;
              const matches = htmlData.match(/Error:\s*([^<]+)(?:<br>|$)/); 
              if (matches && matches[1]) {
                  errorMessage = `Registration failed! ${matches[1].trim()}`;
              } else {
                  errorMessage = 'Registration failed! Unknown error';
              }
          }
      } else if (error.request) {
          errorMessage = 'Registration failed! No response from server';
      } else {
          errorMessage = `Registration failed! ${error.message}`;
      }

      toast.error(errorMessage, {
          autoClose: 2500,
          position: 'bottom-center',
          style: {
              backgroundColor: '#121212',
              color: 'white',
              width: "450px"
          }
      });

      console.log(error);
    });

  }


  return (
    <>
      <link
        rel="preload"
        as="image"
        href="https://images.pexels.com/photos/1144275/pexels-photo-1144275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
      
      <div className="min-h-screen bg-[#121212]">
        <header className="fixed top-0 z-10 mx-auto w-full max-w-full bg-[#121212] p-6  text-white lg:px-10"><span className="cursor-pointer font-bold hover:underline" onClick={() => navigate('/')}> Back</span></header>
        <div className="mx-auto flex w-full items-stretch justify-between gap-10">
          <div className="mt-20 flex w-full flex-col items-start justify-start p-6 md:w-1/2 lg:px-10">
            <div className="w-full">
              <h1 className="mb-2 text-5xl font-extrabold text-white">Register</h1>
              <p className="text-sm text-slate-400 ">Before we start, please create your account</p>
            </div>
            <div className="my-14 flex w-full flex-col items-start justify-start gap-4">
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <label className="text-sm text-slate-200 ">Full Name</label>
                <input
                  placeholder="Enter your full name..."
                  required
                  value={fullName}
                  onChange={(e)=>{setFullName(e.target.value)}}
                  className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500" />
              </div>
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <label className="text-sm text-slate-200">Email</label>
                <input
                  placeholder="Enter an email..."
                  required
                  value={email}
                  onChange={(e)=>{setEmail(e.target.value)}}
                  className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500" />
              </div>
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <label className="text-sm text-slate-200">Username</label>
                <input
                  placeholder="Enter a username..."
                  required
                  value={username}
                  onChange={(e)=>{setUsername(e.target.value)}}
                  className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500" />
              </div>
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <label className="text-sm text-slate-200">Password</label>
                <input
                  placeholder="Enter a password..."
                  type="password"
                  required
                  value={password}
                  onChange={(e)=>{setPassword(e.target.value)}}
                  className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500" />
              </div>
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <label className="text-sm text-slate-200">Avatar</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500" />
              </div>
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <label className="text-sm text-slate-200">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="mr-4 flex items-center">
                <input
                  type="checkbox"
                  id="checkbox-1"
                  className="absolute h-6 w-6 cursor-pointer opacity-0 [&:checked+div]:bg-green-500 [&:checked+div_svg]:block"
                  name="checkbox-1" />
                <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center border-[1px] border-white bg-transparent focus-within:border-white">
                  <svg
                    className="pointer-events-none hidden h-3 w-3 fill-current text-white"
                    version="1.1"
                    viewBox="0 0 17 12"
                    xmlns="http://www.w3.org/2000/svg">
                    <g
                      fill="none"
                      fillRule="evenodd">
                      <g
                        transform="translate(-9 -11)"
                        fill="#000000"
                        fillRule="nonzero">
                        <path
                          d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z"></path>
                      </g>
                    </g>
                  </svg>
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor="checkbox-1"
                    className="text-sm font-medium text-white">
                    You will get emails on new features and releases
                  </label>
                </div>
              </div>
              <div className="mr-4 flex items-center">
                <input
                  type="checkbox"
                  id="checkbox-2"
                  className="absolute h-6 w-6 cursor-pointer opacity-0 [&:checked+div]:bg-green-500 [&:checked+div_svg]:block"
                  name="checkbox-2" />
                <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center border-[1px] border-white bg-transparent focus-within:border-white">
                  <svg
                    className="pointer-events-none hidden h-3 w-3 fill-current text-white"
                    version="1.1"
                    viewBox="0 0 17 12"
                    xmlns="http://www.w3.org/2000/svg">
                    <g
                      fill="none"
                      fillRule="evenodd">
                      <g
                        transform="translate(-9 -11)"
                        fill="#000000"
                        fillRule="nonzero">
                        <path
                          d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z"></path>
                      </g>
                    </g>
                  </svg>
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor="checkbox-2"
                    className="text-sm font-medium text-white">
                    I agree to the terms and conditions
                  </label>
                </div>
              </div>
              <button
                className="w-full bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
                onClick={registerUser}
                disabled={loading}
                >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </div>
                  ) : (
                    "Create Account"
                  )}
              </button>
              
              <p className="my-14 text-sm font-light text-white">
                Already registered ?
                <span className="cursor-pointer font-bold hover:underline" onClick={() => navigate('/signIn')}> Sign in to your account</span>
              </p>
            </div>
          </div>
          <div className="fixed right-0 z-20 hidden h-screen w-1/2 md:block">
            <img
              className="h-full w-full object-cover"
              src="https://images.pexels.com/photos/1144275/pexels-photo-1144275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="register_image" />
          </div>
        </div>
        
      </div>
      
      <ToastContainer />
    </>
  )
}

export default Signup