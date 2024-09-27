import React from 'react'

function Login() {

  const google = () => {
    window.open("http://localhost:5000/auth/google","_self");
  }

  return (
    <div>
        <button onClick={google}>Google</button>
    </div>
  )
}

export default Login