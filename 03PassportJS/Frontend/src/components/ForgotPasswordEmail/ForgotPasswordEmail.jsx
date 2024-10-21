import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function ForgotPasswordEmail() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const params = useParams();

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setSuccess('');
            return;
        }
        await axios.post(`http://localhost:7000/api/v1/users/reset-password/${params.token}`, { newPassword })
        .then(() => {
            setSuccess('Password changed successfully!');
            setError('');
            setNewPassword('');
            setConfirmPassword('');
        })
        .catch(() => {
            setError('Error updating password. Please try again.');
            setSuccess('');
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Reset Your Password</h2>
                <form onSubmit={handlePasswordChange}>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </form>
            </div>

            {/* Go to Home Link */}
            {success && (
                <Link
                    to="http://localhost:5173/"
                    className="mt-6 text-indigo-600 hover:underline focus:outline-none"
                >
                    Go to Home
                </Link>
            )}
        </div>
    );
}

export default ForgotPasswordEmail;
