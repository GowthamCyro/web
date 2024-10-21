import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdateDetails() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "api/v1/socialSign/updateDetails",
                { username, password },
                { withCredentials: true }
            ).then((response) => {
                setSuccessMessage('Profile updated successfully!');
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }).catch((err) => {
                setErrorMessage(err.response?.data?.message || 'Username already Exists');
            });
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'An error occurred while updating the profile'
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Update Your Details</h2>
                
                {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Set a Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your new username"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Set a Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your new password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateDetails;
