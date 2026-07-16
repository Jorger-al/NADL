import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#2f4050] text-white py-8 px-4 mt-auto">
      <div className="w-[90%] max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-center items-center">

        <div className="flex justify-center">
          <div className="text-lg font-light tracking-widest uppercase">
            NADL Archive
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm text-gray-300 items-center">
            <Link to="/contacts" className="hover:text-white transition-colors">
              Contacts
            </Link>

            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="text-sm text-gray-400">
            &copy; 2026 Shipbuilding Digital Archive
          </div>
        </div>

      </div>
    </footer>
  );
}
