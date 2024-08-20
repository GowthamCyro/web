import React from 'react'
import download from '../assets/download.jpg'


function Login() {

  return (
    <>
      <div className='min-h-screen w-full flex flex-col items-center justify-center bg-slate-500' style={{backgroundImage : `url(${download})`,backgroundRepeat:'no-repeat',backgroundSize : 'cover',backgroundPosition : 'center'}}>
      <h1 className='font-bold text-3xl'>TRANSPARENT LOGIN FORM</h1>
        <div className='backdrop-blur-sm min-h-72 w-96 flex items-center justify-center shadow-white shadow-2xl mt-5'> 
          <form  className='flex flex-col items-center justify-center gap-5'>
            <div className='flex flex-col items-start justify-start'>
              <label htmlFor='username' className='font-bold'>Username : </label>
              <input type="text" id='username' className='w-64 bg-white/20 border hover:bg-white shadow-white shadow-2xl'/>
            </div>
            <div className='flex flex-col items-start justify-start'>
              <label htmlFor='password' className='font-bold'>Password : </label>
              <input type="password" id='password' className='w-64 bg-white/20 border hover:bg-white'/>
            </div>
            <button className='font-bold bg-blue/60 text-black w-36 border mt-3 hover:bg-white hover:shadow-white '>Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login