import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "../../context/ToastContext";

export default function Login() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isUnverified, setIsUnverified] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            showToast("Please fill in all fields.", "error");
            setError("Please fill in all fields.");
            return;
        }

        setError("");
        setIsUnverified(false);

        try {
            // 1. Fetch user by email from custom users collection
            const userResponse = await fetch(
                `/directus-api/items/users?filter[email][_eq]=${encodeURIComponent(email)}&fields=*`
            );

            if (!userResponse.ok) {
                throw new Error("Invalid email or password.");
            }

            const userData = await userResponse.json();
            if (!userData.data || userData.data.length === 0) {
                throw new Error("Invalid email or password.");
            }

            const user = userData.data[0];

            // 2. Verify password hash using the Directus utility endpoint
            const verifyResponse = await fetch("/directus-api/utils/hash/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    string: password,
                    hash: user.password,
                }),
            });

            if (!verifyResponse.ok) {
                throw new Error("Invalid email or password.");
            }

            const verifyData = await verifyResponse.json();
            if (!verifyData.data) {
                throw new Error("Invalid email or password.");
            }

            // 3. Block login if the account has not been verified yet
            if (user.status !== "verified") {
                setIsUnverified(true);
                throw new Error(
                    "Your account has not been verified yet. Please check your email inbox and click the verification link we sent you."
                );
            }

            // 4. Save user info to sessionStorage
            sessionStorage.setItem("access_token", String(user.id));
            sessionStorage.setItem("user", JSON.stringify(user));

            if (rememberMe) {
                sessionStorage.setItem("refresh_token", "custom-session-active");
            } else {
                sessionStorage.setItem("refresh_token", "custom-session-active");
            }

            showToast("Login successful!", "success");
            navigate("/");
        } catch (err) {
            showToast(err.message, "error");
            setError(err.message);
        }
    };

    return (
        <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col justify-between text-[#222]">
            <TopNavBar />

            <main className="flex-1 flex items-center justify-center pt-28 pb-14 px-4">
                <div className="w-full max-w-[450px] mx-auto bg-white rounded-xl border border-gray-200 shadow-ambient p-8 md:p-10">
                    {/* Card Header */}
                    <div className="text-center mb-8">
                        <span className="uppercase tracking-[0.25em] text-[10px] text-gray-500 font-medium block mb-2">
                            Nautical Archive Digital Library
                        </span>
                        <h1 className="text-3xl font-light text-[#1e3a5f] font-display tracking-wide">
                            Login
                        </h1>
                    </div>

                    {error && (
                        <div className={`border-l-4 p-4 mb-6 ${isUnverified ? "bg-amber-50 border-amber-400" : "bg-red-50 border-red-500"}`}>
                            <p className={`text-xs ${isUnverified ? "text-amber-700" : "text-red-700"}`}>{error}</p>
                            {isUnverified && (
                                <p className="text-xs text-amber-600 mt-1">
                                    Didn't receive the email?{" "}
                                    <Link to="/register" className="font-medium underline hover:text-amber-800 transition-colors">
                                        Register again
                                    </Link>{" "}
                                    to request a new verification link.
                                </p>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                                    Password
                                </label>
                                <a
                                    href="#forgot"
                                    onClick={(e) => e.preventDefault()}
                                    className="text-xs text-[#687990] hover:text-[#1e3a5f] transition-colors"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40 focus:bg-white transition-colors"
                                required
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f]"
                                />
                                <span className="text-xs text-gray-600 select-none">Remember me on this device</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-[#2f4050] hover:bg-[#1e3a5f] text-white py-4 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>

                    {/* Card Footer */}
                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-[#1e3a5f] font-medium hover:underline transition-colors"
                            >
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
