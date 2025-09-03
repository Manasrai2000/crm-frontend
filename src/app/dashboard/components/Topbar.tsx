'use client';

import { API } from "@/config/api_urls";
import axios from "axios"
import { useState, useRef, useEffect } from 'react';

type SubMenu = {
  public_secret: string;
  title: string;
  icon: string;
  actions?: Action[];
};

type Action = {
  public_secret: string;
  name: string;
  description: string;
}

type TopbarProps = {
  selectedSubMenu: SubMenu | null;
  onMenuToggle: () => void;
  sidebarCollapsed: boolean;
};

export default function Topbar({ selectedSubMenu, onMenuToggle, sidebarCollapsed }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);


  const handleLogout = async () => {
    try {
      // Refresh token from localStorage
      const refreshToken = localStorage.getItem("refresh")

      if (!refreshToken) {
        alert("No refresh token found")
        return
      }

      // Call logout API
      const response = await axios.post(
        API.LOGOUT,
        { refresh: refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        }
      )

      console.log("Logout response:", response.data)

      localStorage.removeItem("token")
      localStorage.removeItem("refresh")
      window.location.href = "/"
    } catch (error: any) {
      console.error("Logout error:", error.response?.data || error.message)
      alert("Logout failed")
    }
  }


  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  const fullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
      });
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between h-[48px] items-center px-2 sm:px-4 py-1 border-b shadow-sm bg-white w-full">
      <div className="flex items-center">
        <button
          className="flex items-center justify-center mr-2 sm:mr-4 text-gray-700 hover:text-blue-600 focus:outline-none"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ height: '24px', width: '24px' }}
        >
          {/* Hamburger icon */}
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center">
          <div className="m-0 font-semibold text-gray-800 text-base sm:text-lg truncate max-w-[180px] sm:max-w-xs">
            {selectedSubMenu?.title || 'Dashboard'}
          </div>
        </div>
      </div>

      <div className="flex items-center py-1">
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center focus:outline-none"
            onClick={toggleDropdown}
            aria-label="User menu"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="User avatar"
              className="rounded-full shadow-sm border w-8 h-8"
              style={{ cursor: 'pointer' }}
            />
            {/* Chevron Down Icon */}
            <svg className="w-4 h-4 ml-2 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-52 bg-white rounded shadow-lg border z-20"
            >
              <div className="px-4 py-2">
                <small className="text-gray-400">Signed in as</small>
                <div className="font-semibold text-gray-800">John Doe</div>
              </div>
              <hr className="my-1 border-gray-200" />
              <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-left">
                {/* User Icon */}
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Profile
              </button>
              <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-left">
                {/* Gear Icon */}
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0a1.724 1.724 0 002.573 1.01c.797-.46 1.757.38 1.297 1.176a1.724 1.724 0 001.01 2.573c.921.3.921 1.603 0 1.902a1.724 1.724 0 00-1.01 2.573c.46.797-.38 1.757-1.176 1.297a1.724 1.724 0 00-2.573 1.01c-.3.921-1.603.921-1.902 0a1.724 1.724 0 00-2.573-1.01c-.797.46-1.757-.38-1.297-1.176a1.724 1.724 0 00-1.01-2.573c-.921-.3-.921-1.603 0-1.902a1.724 1.724 0 001.01-2.573c-.46-.797.38-1.757 1.176-1.297a1.724 1.724 0 002.573-1.01z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <button
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-left"
                onClick={fullscreenToggle}
              >
                {/* Fullscreen Icon */}
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  {isFullscreen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l-6 6m0 0l6 6m-6-6h18" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 00-2 2v3m0 8v3a2 2 0 002 2h3m8-16h3a2 2 0 012 2v3m0 8v3a2 2 0 01-2 2h-3" />
                  )}
                </svg>
                {isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'}
              </button>
              <hr className="my-1 border-gray-200" />
              <button
                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition text-left"
                onClick={handleLogout}
              >
                {/* Logout Icon */}
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}