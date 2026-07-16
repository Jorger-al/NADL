import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "../context/ToastContext";

export default function VerifyFind() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showToast } = useToast();

    // Authentication & Role State
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAuthWarning, setShowAuthWarning] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Data State
    const [findData, setFindData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [generatedSiteId, setGeneratedSiteId] = useState(null);

    // Check admin status on mount
    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        const userData = sessionStorage.getItem("user");
        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                setCurrentUser(user);
                if (user.role === "admin") {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                    setShowAuthWarning(true);
                }
            } catch (e) {
                setIsAdmin(false);
                setShowAuthWarning(true);
            }
        } else {
            setIsAdmin(false);
            setShowAuthWarning(true);
        }
    }, []);

    // Load reported find details
    useEffect(() => {
        if (!id || !isAdmin) return;

        const fetchFindDetails = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/reported_finds/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to load discovery details.");
                }
                const result = await response.json();
                setFindData(result.data);
            } catch (err) {
                showToast(err.message, "error");
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFindDetails();
    }, [id, isAdmin]);

    // Fetch associated site if already verified
    useEffect(() => {
        if (!findData || findData.status !== "verified") return;

        const fetchMatchingSite = async () => {
            try {
                // Try finding by coordinates or description
                const latQuery = findData.latitude ? `&filter[lat][_eq]=${findData.latitude}` : "";
                const lngQuery = findData.longitude ? `&filter[lng][_eq]=${findData.longitude}` : "";
                let query = `/directus-api/items/sites?limit=1`;

                if (findData.latitude && findData.longitude) {
                    query += `${latQuery}${lngQuery}`;
                } else if (findData.description) {
                    query += `&filter[description][_eq]=${encodeURIComponent(findData.description)}`;
                }

                const response = await fetch(query);
                if (response.ok) {
                    const result = await response.json();
                    if (result.data && result.data.length > 0) {
                        setGeneratedSiteId(result.data[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch matching site:", err);
            }
        };

        fetchMatchingSite();
    }, [findData]);

    const handleVerify = async () => {
        if (!findData) return;
        setActionLoading(true);
        setError("");

        try {
            // 1. Create the site item in the sites collection
            const refCode = findData.id ? findData.id.slice(0, 8).toUpperCase() : "RF-NEW";

            const sitePayload = {
                id: `reported_finds_${refCode}`,
                ref: refCode,
                name: findData.name,
                description: findData.description || "",
                lat: findData.latitude ? parseFloat(findData.latitude) : 0,
                lng: findData.longitude ? parseFloat(findData.longitude) : 0,
                collection: "reported_finds",
                layer: "Reported Finds",
                layer_category: findData.type || "other",
                status: "",
                site_image: findData.image || null,
            };

            const postRes = await fetch("${import.meta.env.VITE_DIRECTUS_URL}/items/sites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sitePayload),
            });

            if (!postRes.ok) {
                throw new Error("Failed to create the site entry.");
            }

            const postResult = await postRes.json();
            const newSiteId = postResult.data.id;

            // 2. Update status to verified
            const patchRes = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/reported_finds/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "verified" }),
            });
            if (!patchRes.ok) throw new Error("Failed to update discovery status to verified.");

            setGeneratedSiteId(newSiteId);
            setFindData(prev => ({ ...prev, status: "verified" }));
            showToast("Discovery verified successfully!", "success");
        } catch (err) {
            showToast(err.message, "error");
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeny = async () => {
        if (!findData) return;
        setActionLoading(true);
        setError("");

        try {
            const authorVal = findData.author;
            const isAuthorNull = !authorVal || authorVal === "None" || authorVal === "NULL" || authorVal.trim().toUpperCase() === "NULL";

            if (!isAuthorNull) {
                // Change status to denied
                const patchRes = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/reported_finds/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: "denied" }),
                });
                if (!patchRes.ok) throw new Error("Failed to change discovery status to denied.");
            } else {
                // Delete reported find
                const deleteRes = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/reported_finds/${id}`, {
                    method: "DELETE",
                });
                if (!deleteRes.ok) throw new Error("Failed to delete the discovery report.");
            }

            // Redirect to Submitted Finds list
            showToast(isAuthorNull ? "Discovery report deleted successfully." : "Discovery status set to denied.", "success");
            navigate("/submitted-finds");
        } catch (err) {
            showToast(err.message, "error");
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (showAuthWarning) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-[#1e3a5f] font-display mb-2">Access Denied</h3>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        This area is restricted to administrators. Please sign in with an administrator account to continue.
                    </p>
                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-[#2f4050] hover:bg-[#1e3a5f] text-white py-3 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                        >
                            Sign In / Login
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                        >
                            Return to Homepage
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
            <TopNavBar />

            <main className="flex-1 mt-20 pb-20 px-4">
                {/* Header */}
                <section className="w-[90%] bg-[#f3f4f6] py-2 mt-8 max-w-[900px] mx-auto">
                    <div className="flex items-start gap-4 mb-2">
                        <div className="w-[3px] h-16 bg-[#705a44] shrink-0"></div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                                Review Submitted Find
                            </h1>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                                Verification Console — Maritime Archaeology
                            </p>
                        </div>
                    </div>
                </section>

                <div className="w-[90%] max-w-[900px] mx-auto mt-10">
                    {loading && (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                            <p className="text-sm text-[#687990]">Loading discovery report details...</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-sm text-xs text-red-700">
                            {error}
                        </div>
                    )}

                    {!loading && !error && findData && (
                        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            {/* Visual Header / Cover Image */}
                            <div className="relative h-64 bg-gray-800">
                                <img
                                    src={
                                        findData.image
                                            ? `/directus-api/assets/${findData.image}`
                                            : "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2070&auto=format&fit=crop"
                                    }
                                    alt="Discovery Media"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                <div className="absolute bottom-6 left-8 right-8 text-white">
                                    <span className="bg-[#705a44] px-3 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-wider">
                                        {findData.type || "Unknown Type"}
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-light mt-2 font-display capitalize">
                                        {findData.name || "Discovery"}
                                    </h2>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="p-8 md:p-10 space-y-8">
                                {/* Description */}
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                        Description
                                    </h3>
                                    <p className="text-sm text-gray-700 leading-relaxed font-light whitespace-pre-wrap">
                                        {findData.description || "No description provided."}
                                    </p>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Coordinates & Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                            Latitude
                                        </h3>
                                        <p className="text-base text-[#2f4050] font-mono">
                                            {findData.latitude ?? "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                            Longitude
                                        </h3>
                                        <p className="text-base text-[#2f4050] font-mono">
                                            {findData.longitude ?? "—"}
                                        </p>
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Submitter / Metadata */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                            Author / Submitter
                                        </h3>
                                        <p className="text-sm font-medium text-gray-800">
                                            {findData.author || "None"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                            Email Address
                                        </h3>
                                        <p className="text-sm text-gray-600 truncate">
                                            {findData.email || "None"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                            Institution
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {findData.institution || "None"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                            Date Submitted
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            {formatDate(findData.created_at || findData.date_created)}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                            Current Status
                                        </h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 capitalize">
                                            {findData.status || "Pending"}
                                        </span>
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full">
                                    {findData.status === "verified" ? (
                                        <button
                                            onClick={() => navigate(`/site/${generatedSiteId}`)}
                                            disabled={!generatedSiteId}
                                            className="flex border border-[#2f4050] text-[#2f4050] px-6 py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#2f4050] hover:text-white transition-colors w-full items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                edit
                                            </span>
                                            {generatedSiteId ? "GO TO SITE DETAILS" : "LOADING SITE DETAILS..."}
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleVerify}
                                                disabled={actionLoading}
                                                className="flex border border-[#43a047] text-[#43a047] px-6 py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#43a047] hover:text-white transition-colors flex-1 items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    check
                                                </span>
                                                {actionLoading ? "VERIFYING..." : "VERIFY FIND"}
                                            </button>
                                            <button
                                                onClick={handleDeny}
                                                disabled={actionLoading}
                                                className="flex border border-[#c62828] text-[#c62828] px-6 py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#c62828] hover:text-white transition-colors flex-1 items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    delete
                                                </span>
                                                {actionLoading ? "DENYING..." : "DENY FIND"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
