import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setError("Invalid or missing verification token.");
            return;
        }

        async function verify() {
            try {
                // 1. Find the user with this verification token
                const userResponse = await fetch(
                    `/directus-api/items/users?filter[verification_token][_eq]=${encodeURIComponent(token)}&fields=id,status,verification_token&limit=1`
                );

                if (!userResponse.ok) {
                    throw new Error("Failed to validate the verification token. Please try again.");
                }

                const userData = await userResponse.json();

                if (!userData.data || userData.data.length === 0) {
                    throw new Error("Invalid or expired verification link. Please register again.");
                }

                const user = userData.data[0];

                if (user.status === "verified") {
                    // Already verified — treat as success
                    setStatus("success");
                    return;
                }

                // 2. Update the user's status to "verified" and clear the token
                const updateResponse = await fetch(`/directus-api/items/users/${user.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: "verified",
                        verification_token: null,
                    }),
                });

                if (!updateResponse.ok) {
                    const data = await updateResponse.json().catch(() => ({}));
                    const message = data.errors?.[0]?.message || "Failed to verify your email. Please try again.";
                    throw new Error(message);
                }

                setStatus("success");
            } catch (err) {
                setStatus("error");
                setError(err.message);
            }
        }

        verify();
    }, [token]);

    return (
        <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col justify-between text-[#222]">
            <TopNavBar />
            <main className="flex-1 flex items-center justify-center pt-28 pb-8 px-4">
                <div className="w-full max-w-[450px] mx-auto bg-white rounded-xl border border-gray-200 shadow-ambient p-8 md:p-10 text-center">
                    <div className="mb-6">
                        <span className="uppercase tracking-[0.25em] text-[10px] text-gray-500 font-medium block mb-2">
                            Nautical Archive Digital Library
                        </span>
                        <h1 className="text-3xl font-light text-[#1e3a5f] font-display tracking-wide">
                            Email Verification
                        </h1>
                    </div>

                    {status === "verifying" && (
                        <div className="space-y-4">
                            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#1e3a5f] rounded-full animate-spin mx-auto"></div>
                            <p className="text-sm text-gray-600">Verifying your email address, please wait...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="space-y-6">
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 text-left">
                                <p className="text-sm text-green-700 font-medium mb-1">Email verified successfully!</p>
                                <p className="text-xs text-green-600">
                                    Your account is now active. You can sign in and start using the platform.
                                </p>
                            </div>
                            <Link
                                to="/login"
                                className="w-full inline-block bg-[#2f4050] hover:bg-[#1e3a5f] text-white py-4 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="space-y-6">
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-left">
                                <p className="text-sm text-red-700 font-medium mb-1">Verification failed</p>
                                <p className="text-xs text-red-600">{error}</p>
                            </div>
                            <Link
                                to="/register"
                                className="w-full inline-block bg-[#2f4050] hover:bg-[#1e3a5f] text-white py-4 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                            >
                                Try Registering Again
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
