import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
    const navigate = useNavigate()  
    const [email, setEmail] = useState('')
    const [loading,setLoading] = useState(false)
    const startRecovery = async(e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post("/api/v1/users/forgotPassword",{"email" : email })
        .then(function (response) {
            setLoading(false);
            toast.success("Email Sent Successfully !",{
              autoClose: 3000,  
              hideProgressBar: true,
              position : 'bottom-center',
              style : {
                backgroundColor : '#121212',
                color : 'white'
              }
            })
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
            } 
            else if (error.request) {
                errorMessage = 'Registration failed! No response from server';
            } 
            else {
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
            <div class="min-h-screen bg-[#121212]">
                
                <div class="mx-auto flex w-full items-stretch justify-between gap-10">
                    <div class="mt-20 flex w-full flex-col items-start justify-start p-6 md:w-1/2 lg:px-10">
                    <div class="w-full">
                        <h1 class="mb-2 text-5xl font-extrabold text-white">Forgot password?</h1>
                        <p class="text-sm text-slate-400">An email will be send your mail for the password recovery.</p>
                    </div>
                    <div class="my-14 flex w-full flex-col items-start justify-start gap-4">
                        <div class="flex w-full flex-col items-start justify-start gap-2">
                        <label class="text-xs text-slate-200">Email</label>
                        <input
                            placeholder="Enter an email..."
                            autocomplete="false"
                            type="email"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            class="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500" />
                        </div>
                        <button
                            className="w-full bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
                            onClick={startRecovery}
                            disabled={loading}>
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
                                "Start Recovery"
                            )}
                        </button>
                        <p class="my-14 text-sm font-light text-white">
                        Remembered Your Password ?
                        <span class="cursor-pointer font-bold hover:underline" onClick={() => navigate('/signIn')}> GoBack</span>
                        </p>
                    </div>
                    </div>
                    <div class="fixed right-0 z-20 hidden h-screen w-1/2 md:block">
                    <img
                        class="h-full w-full object-cover"
                        src="https://images.pexels.com/photos/1144275/pexels-photo-1144275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="register_image" />
                    </div>
                </div>
            </div>
        </>
    )
    }

    export default ForgotPassword