import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function EmailVerify() {
    const [validUrl, setValidUrl] = useState(null); // `null` for initial state
    const param = useParams();

    const handleVerifyEmail = async () => {
        try {
            const url = `http://localhost:7000/api/v1/users/${param.id}/verify/${param.token}`;
            await axios.get(url);
            setValidUrl(true);   
        } catch (error) {
            console.log(error);
            setValidUrl(false);  
        }
    };

    
    if (validUrl === null) {
        return (
            <div className='w-full h-screen flex flex-col items-center justify-center'>
                <h1 className='text-9xl'>Email Verification!</h1>
                <button onClick={handleVerifyEmail} className='border-1 p-2'>Verify Email</button>
            </div>
        );
    }

    
    return (
        <>
            {validUrl ? (
                <div className='w-full h-screen flex flex-col items-center justify-center'>
                    <h1 className='text-9xl'>Email Verified Successfully!</h1>
                    <p className='p-2'>
                        <Link to="/signIn">Click here to log in</Link>
                    </p>
                </div>
            ) : (
                <h1>404 Page Not Found</h1>
            )}
        </>
    );
}

export default EmailVerify;
