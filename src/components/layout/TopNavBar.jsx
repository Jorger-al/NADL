import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/data/Images/Logo_Minimized.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portugal-uch", label: "Portugal UCH" },
  { to: "/outreach", label: "Outreach" },
  { to: "/blog", label: "Blog" },
  { to: "/shipbuilding", label: "Shipbuilding" },
  { to: "/submitfind", label: "Submit Find" },
];

const activeClass = "font-display tracking-tight text-sm uppercase text-[#2f4050] border-b-2 border-[#705a44] pb-1";
const inactiveClass = "font-display tracking-tight text-sm uppercase text-[#687990] hover:text-[#2f4050] transition-colors";

export function TopNavBar() {
  const { pathname } = useLocation();
  const isGlobePage = pathname === "/";

  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("access_token");
      const storedUser = sessionStorage.getItem("user");
      const isAuth = !!token;
      setIsAuthenticated(isAuth);

      if (isAuth && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUserRole(parsed?.role || null);
          setUserAvatar(parsed?.avatar || null);
        } catch {
          setUserRole(null);
          setUserAvatar(null);
        }
      } else {
        setUserRole(null);
        setUserAvatar(null);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("user");

    setDropdownOpen(false);
    setIsAuthenticated(false);
    setUserRole(null);

    navigate("/");
  };

  const isAdmin = userRole === "admin";

  return (
    <nav className={`fixed top-0 w-full z-40 flex justify-between items-center px-4 md:px-8 h-20 bg-[#ffffff] shadow-ambient`}>

      <img
        src={logo}
        alt="NADL Logo"
        className="w-30 h-14 object-cover"
      />
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={pathname === to ? activeClass : inactiveClass}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="font-display tracking-tight text-sm uppercase text-[#687990] hover:text-[#2f4050] transition-colors"
            >
              Login
            </Link>
          ) : (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 text-[#2f4050] hover:bg-[#2f4050]/10 transition-all duration-300 rounded-sm flex items-center justify-center w-12 h-12"
              >
                {userAvatar ? (
                  <img
                    src={`/directus-api/assets/${userAvatar}`}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-[32px]">
                    account_circle
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-3 text-sm text-[#687990] hover:bg-gray-50 hover:text-[#2f4050] transition-colors"
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/my-publications"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-3 text-sm text-[#687990] hover:bg-gray-50 hover:text-[#2f4050] transition-colors"
                  >
                    My Publications
                  </Link>

                  {isAdmin && (
                    <>
                      <Link
                        to="/submitted-finds"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm text-[#687990] hover:bg-gray-50 hover:text-[#2f4050] transition-colors"
                      >
                        Submitted Finds
                      </Link>

                      <Link
                        to="/submitted-posts"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm text-[#687990] hover:bg-gray-50 hover:text-[#2f4050] transition-colors"
                      >
                        Submitted Posts
                      </Link>
                    </>
                  )}

                  <div className="border-t border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-[#705a44] hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {/* Mobile menu toggle */}
        <button className="md:hidden p-2 text-[#2f4050] rounded-sm">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>
  );
}
