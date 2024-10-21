import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function EmailVerify() {
    const [validUrl, setValidUrl] = useState(null); 
    const [loading, setLoading] = useState(false);  
    const param = useParams();

    const handleVerifyEmail = async () => {
        setLoading(true);
        try {
            const url = `api/v1/users/${param.id}/verify/${param.token}`;
            await axios.get(url);
            setValidUrl(true);   
        } catch (error) {
            console.log(error);
            setValidUrl(false);  
        }
        setLoading(false);
    };

    if (validUrl === null) {
        return (
            <div className='w-full h-screen flex flex-col items-center justify-center bg-gray-100'>
                <div className='p-8 bg-white shadow-md rounded-md text-center'>
                    <h1 className='text-4xl font-semibold text-gray-800 mb-6'>Email Verification</h1>
                    <p className='text-lg text-gray-600 mb-4'>Please click the button below to verify your email.</p>
                    <button 
                        onClick={handleVerifyEmail} 
                        className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none'
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full h-screen flex flex-col items-center justify-center bg-gray-100'>
            {validUrl ? (
                <div className='p-8 bg-green-100 shadow-md rounded-md text-center'>
                    <h1 className='text-4xl font-semibold text-green-800 mb-6'>Success!</h1>
                    <p className='text-lg text-gray-700 mb-4'>Your email has been verified successfully.</p>
                    <Link to="/signIn" className='text-blue-500 hover:underline'>
                        Click here to log in
                    </Link>
                </div>
            ) : (
                <div className='p-8 bg-red-100 shadow-md rounded-md text-center'>
                    <h1 className='text-4xl font-semibold text-red-800 mb-6'>Verification Failed</h1>
                    <p className='text-lg text-gray-700 mb-4'>The link is invalid or has expired. Please try again.</p>
                </div>
            )}
        </div>
    );
}

export default EmailVerify;
