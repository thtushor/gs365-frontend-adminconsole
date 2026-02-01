import React, { useState } from "react";
import axios from "axios";
import { BASE_URL, API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

const ForgotPasswordPopup = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post(BASE_URL + API_LIST.FORGOT_PASSWORD, {
                email,
            });

            if (data.status) {
                toast.success(data.message || "Reset link sent to your email");
                setIsSent(true);
            } else {
                toast.error(data.message || "Failed to send reset link");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-green-700 text-center mb-2">Forgot Password</h2>

                {isSent ? (
                    <div className="text-center">
                        <div className="mb-4 text-green-500">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 mb-6 font-medium">
                            A password reset link has been sent to <br />
                            <span className="text-gray-900 font-bold">{email}</span>
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 text-center mb-8 text-sm">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    placeholder="Enter your registered email"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-500 text-sm font-medium hover:text-gray-700 text-center"
                            >
                                Back to Sign In
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPopup;
