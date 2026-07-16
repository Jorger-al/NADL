import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "../../context/ToastContext";

/** Generates a random hex verification token (32 bytes = 64 hex chars). */
function generateVerificationToken() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function Register() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !confirmPassword) {
            showToast("Please fill in all fields.", "error");
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            setError("Passwords do not match.");
            return;
        }
        setError("");
        setIsLoading(true);

        try {
            const verificationToken = generateVerificationToken();

            // 1. Create user with status "verified" and the verification token
            const response = await fetch("/directus-api/items/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    status: "verified",
                    verification_token: verificationToken,
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                const message = data.errors?.[0]?.message || "Failed to register. Please try again.";
                throw new Error(message);
            }

            // 2. User created — show success screen immediately regardless of email outcome
            showToast("Account created successfully!", "success");
            setIsRegistered(true);

        } catch (err) {
            showToast(err.message, "error");
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col justify-between text-[#222]">
            <TopNavBar />

            <main className="flex-1 flex items-center justify-center pt-28 pb-8 px-4">
                <div className="w-full max-w-[450px] mx-auto bg-white rounded-xl border border-gray-200 shadow-ambient p-8 md:p-10">
                    {isRegistered ? (
                        <>
                            {/* Card Header */}
                            <div className="text-center mb-8">
                                <span className="uppercase tracking-[0.25em] text-[10px] text-gray-500 font-medium block mb-2">
                                    Nautical Archive Digital Library
                                </span>
                                <h1 className="text-3xl font-light text-[#1e3a5f] font-display tracking-wide">
                                    Account Created
                                </h1>
                            </div>

                            <div className="text-center py-4">
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
                                    <p className="text-xs text-blue-700 font-medium mb-1">
                                        Your account has been successfully created!
                                    </p>
                                    <p className="text-xs text-blue-600">
                                        Please return to the Login Page and login with your new credentials.
                                    </p>
                                </div>
                                <Link
                                    to="/login"
                                    className="w-full inline-block bg-[#2f4050] hover:bg-[#1e3a5f] text-white py-4 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                                >
                                    Go to Login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Card Header */}
                            <div className="text-center mb-8">
                                <span className="uppercase tracking-[0.25em] text-[10px] text-gray-500 font-medium block mb-2">
                                    Nautical Archive Digital Library
                                </span>
                                <h1 className="text-3xl font-light text-[#1e3a5f] font-display tracking-wide">
                                    Create Account
                                </h1>
                            </div>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                    <p className="text-xs text-red-700">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name Field */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                                        First &amp; Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40 focus:bg-white transition-colors"
                                        required
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@nadl.pt"
                                        className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40 focus:bg-white transition-colors"
                                        required
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimum 8 characters"
                                        className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40 focus:bg-white transition-colors"
                                        required
                                    />
                                </div>

                                {/* Confirm Password Field */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat password"
                                        className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40 focus:bg-white transition-colors"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-[#2f4050] hover:bg-[#1e3a5f] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                                    >
                                        {isLoading ? "Registering..." : "Register"}
                                    </button>
                                </div>
                            </form>

                            {/* Card Footer */}
                            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                <p className="text-xs text-gray-500">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="text-[#1e3a5f] font-medium hover:underline transition-colors"
                                    >
                                        Login here
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
