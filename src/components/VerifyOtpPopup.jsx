import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

const VerifyOtpPopup = ({ email, onClose, onSuccess }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text").replace(/\D/g, "");
        const pasteData = pastedText.slice(0, 6).split("");

        if (pasteData.length > 0) {
            const newOtp = [...otp];
            pasteData.forEach((char, index) => {
                newOtp[index] = char;
            });
            setOtp(newOtp);

            // Focus the next available input or the last one
            const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
            const targetInput = document.getElementById(`otp-${nextIndex}`);
            if (targetInput) targetInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length < 6) {
            toast.error("Please enter a 6-digit OTP");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post(BASE_URL + API_LIST.VERIFY_OTP, {
                email,
                otp: otpString,
            });

            if (data.status) {
                toast.success(data.message || "Email verified successfully");
                onSuccess();
            } else {
                toast.error(data.message || "Verification failed");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        setIsLoading(true);
        try {
            const { data } = await axios.post(BASE_URL + API_LIST.RESEND_OTP, {
                email,
            });
            if (data.status) {
                toast.success(data.message || "OTP resent successfully");
                setTimer(60);
                setCanResend(false);
            } else {
                toast.error(data.message || "Failed to resend OTP");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend OTP");
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

                <h2 className="text-2xl font-bold text-green-700 text-center mb-2">Verify Email</h2>
                <p className="text-gray-600 text-center mb-8 text-sm">
                    Please enter the 6-digit code sent to <br />
                    <span className="font-semibold text-gray-800">{email}</span>
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex justify-between gap-1 sm:gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-10 h-12 sm:w-12 sm:h-14 border-2 border-gray-200 rounded-lg text-center text-xl font-bold focus:border-green-500 focus:outline-none transition-colors"
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
                    >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>

                    <div className="text-center">
                        <span className="text-sm text-gray-500">Didn't receive code? </span>
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={!canResend || isLoading}
                            className={`text-sm font-semibold transition-colors ${canResend ? "text-green-600 hover:text-green-700 underline" : "text-gray-400"
                                }`}
                        >
                            Resend OTP {timer > 0 && `(${timer}s)`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpPopup;
