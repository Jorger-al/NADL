import React, { useEffect, useState } from "react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "../../context/ToastContext";

export default function Profile() {
    const { showToast } = useToast();
    const [user, setUser] = useState(null);
    const [backupUser, setBackupUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editAvatarFile, setEditAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = React.useRef(null);

    // Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem("access_token");

                if (!token) {
                    throw new Error("You must be logged in.");
                }

                const response = await fetch(
                    `${import.meta.env.VITE_DIRECTUS_URL}/items/users/${token}?fields=id,avatar,name,email,location,title,institution,description,role`
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.errors?.[0]?.message ||
                        "Failed to load profile."
                    );
                }

                setUser(result.data);
                setBackupUser(result.data);
                setAvatarPreview(result.data.avatar ? `/directus-api/assets/${result.data.avatar}` : null);
            } catch (err) {
                showToast(err.message, "error");
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                showToast("Please upload an image file only.", "error");
                setError("Please upload an image file only.");
                return;
            }
            setEditAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");

            const token = sessionStorage.getItem("access_token");
            let fileId = user.avatar;

            if (editAvatarFile) {
                const formData = new FormData();
                formData.append("file", editAvatarFile);

                const uploadRes = await fetch("${import.meta.env.VITE_DIRECTUS_URL}/files", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadRes.ok) {
                    throw new Error("Failed to upload avatar image.");
                }

                const uploadData = await uploadRes.json();
                fileId = uploadData.data.id;
            }

            const response = await fetch(
                `${import.meta.env.VITE_DIRECTUS_URL}/items/users/${token}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: user.name,
                        location: user.location,
                        title: user.title,
                        institution: user.institution,
                        description: user.description,
                        avatar: fileId,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.errors?.[0]?.message ||
                    "Failed to update profile."
                );
            }

            const updatedUser = { ...user, avatar: fileId };
            setUser(updatedUser);
            setBackupUser(updatedUser);
            setEditAvatarFile(null);
            setAvatarPreview(fileId ? `/directus-api/assets/${fileId}` : null);

            sessionStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            window.dispatchEvent(new Event("storage"));
            showToast("Profile updated successfully!", "success");
            setIsEditing(false);

        } catch (err) {
            showToast(err.message, "error");
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
            <TopNavBar />

            <main className="flex-1 mt-20 pb-20">

                {/* Header */}
                <section className="bg-[#f3f4f6] py-2 px-4 mt-8">
                    <div className="w-[90%] max-w-[900px] mx-auto">
                        <div className="flex items-start gap-4 mb-2">
                            <div className="w-[3px] h-16 bg-[#705a44] shrink-0"></div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                                    My Profile
                                </h1>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                                    Nautical Archaeology Digital Library
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <div className="w-[90%] max-w-[900px] mx-auto mt-10">

                    {loading && (
                        <div className="text-center py-10">
                            <p className="text-sm text-gray-500">
                                Loading profile...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
                            <p className="text-xs text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    {!loading && !error && user && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-10">

                            <div className="grid lg:grid-cols-[1fr_280px] gap-10">
                                {/* RIGHT COLUMN (now on the left) */}
                                <div className="space-y-8">

                                    <section>
                                        <h2 className="text-sm uppercase tracking-widest text-[#687990] mb-5">
                                            Basic Information
                                        </h2>

                                        <div className="grid md:grid-cols-1 gap-6">

                                            <EditableField
                                                label="Name"
                                                value={user.name}
                                                editable={isEditing}
                                                onChange={(value) =>
                                                    setUser({
                                                        ...user,
                                                        name: value,
                                                    })
                                                }
                                            />

                                            <ProfileField
                                                label="Email"
                                                value={user.email}
                                            />

                                            <EditableField
                                                label="Location"
                                                value={user.location}
                                                editable={isEditing}
                                                onChange={(value) =>
                                                    setUser({
                                                        ...user,
                                                        location: value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </section>

                                    <div className="border-t border-gray-100" />

                                    <section>
                                        <h2 className="text-sm uppercase tracking-widest text-[#687990] mb-5">
                                            Professional Information
                                        </h2>

                                        <div className="grid md:grid-cols-1 gap-6">

                                            <EditableField
                                                label="Ocupation / Profession"
                                                value={user.title}
                                                editable={isEditing}
                                                onChange={(value) =>
                                                    setUser({
                                                        ...user,
                                                        title: value,
                                                    })
                                                }
                                            />

                                            <EditableField
                                                label="Institution"
                                                value={user.institution}
                                                editable={isEditing}
                                                onChange={(value) =>
                                                    setUser({
                                                        ...user,
                                                        institution: value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </section>

                                </div>

                                 {/* LEFT COLUMN (now on the right) */}
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <div
                                            className={`relative ${isEditing ? "cursor-pointer group" : ""}`}
                                            onClick={() => isEditing && fileInputRef.current.click()}
                                        >
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt={user.name}
                                                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                                                />
                                            ) : (
                                                <span
                                                    className="material-symbols-outlined text-[#687990]"
                                                    style={{
                                                        fontSize: "160px",
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    account_circle
                                                </span>
                                            )}
                                            {isEditing && (
                                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs uppercase tracking-wider font-semibold border-4 border-transparent">
                                                    Upload
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="mt-4 text-xl font-light text-[#1e3a5f] font-display text-center">
                                            {user.name}
                                        </h2>
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div>
                                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2">
                                            Description
                                        </label>

                                        {isEditing ? (
                                            <textarea
                                                value={user.description || ""}
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        description: e.target.value,
                                                    })
                                                }
                                                rows={8}
                                                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-4 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40"
                                            />
                                        ) : (
                                            <div className="bg-[#f8f9fa] border border-gray-200 rounded-sm p-4">
                                                <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">
                                                    {user.description ||
                                                        "No description provided."}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>

                            {/* Centered buttons */}
                            <div className="pt-8 mt-8 border-t border-gray-100 flex justify-center gap-4">

                                {!isEditing ? (
                                    <button
                                        onClick={() => {
                                            setBackupUser({ ...user });
                                            setIsEditing(true);
                                        }}
                                        className="bg-[#2f4050] hover:bg-[#1e3a5f] text-white py-3 px-8 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                                    >
                                        EDIT PROFILE
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="bg-[#2f4050] hover:bg-[#1e3a5f] disabled:opacity-50 text-white py-3 px-8 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                                        >
                                            {saving ? "Saving..." : "SAVE CHANGES"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setUser(backupUser);
                                                setIsEditing(false);
                                            }}
                                            disabled={saving}
                                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-8 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                                        >
                                            CANCEL
                                        </button>
                                    </>
                                )}

                            </div>

                        </div>
                    )}

                </div>

            </main>

            <Footer />
        </div>
    );
}

function ProfileField({ label, value }) {
    return (
        <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2">
                {label}
            </label>

            <div className="bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3 text-sm text-[#374151] min-h-[48px] flex items-center">
                {value || "—"}
            </div>
        </div>
    );
}

function EditableField({
    label,
    value,
    editable,
    onChange,
}) {
    return (
        <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2">
                {label}
            </label>

            {editable ? (
                <input
                    type="text"
                    value={value || ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40"
                />
            ) : (
                <div className="bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3 text-sm text-[#374151] min-h-[48px] flex items-center">
                    {value || "—"}
                </div>
            )}
        </div>
    );
}
