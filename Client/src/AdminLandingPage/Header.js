import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Logo from "../assets/logosaas.png";
import Button from "./Button";

const Header = () => {
  const [scroll, setScroll] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state
  const navigate = useNavigate();

  const getCookie = (name) => {
    return Cookies.get(name); // Use js-cookie to get cookies
  };

  const fetchUserInfo = async () => {
    const token = getCookie("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3002/admin/admin-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.name) {
        setUserName(response.data.name);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // On mount, check if token exists and fetch user info
    const token = getCookie("token");

    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo();
    }

    // Handle scroll behavior
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden"; // Disable scroll when menu is open
  };

  return (
    <header
      className={`sticky top-0 z-20 ${
        scroll ? "bg-[#0E0C17]" : "bg-[#0E0C17]"
      } transition-colors text-white`}
    >
      <div className="py-5 flex justify-center items-center bg-black text-white text-sm gap-3">
        <div className="container">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center">
              <img src={Logo} alt="Logo" height={40} width={40} />
              <h1 className="font-bold text-[1.4rem] ml-1">WorkWave</h1>
            </NavLink>

            {/* Hamburger Icon for mobile */}
            <div className="sm:hidden flex items-center">
              <button onClick={toggleMenu} className="text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="mobile-menu fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex flex-col justify-start items-center text-white z-10">
                <button
                  onClick={toggleMenu}
                  className="absolute top-5 right-5 text-white text-3xl"
                >
                  &times;
                </button>
                <NavLink
                  to="/"
                  onClick={toggleMenu}
                  className="py-4 w-full text-center text-3xl"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/business-add-business"
                  onClick={toggleMenu}
                  className="py-4 w-full text-center text-3xl"
                >
                  Add Business
                </NavLink>
                <NavLink
                  to="/AboutUs"
                  onClick={toggleMenu}
                  className="py-4 w-full text-center text-3xl"
                >
                  About Us
                </NavLink>

                {!isLoggedIn ? (
                  <NavLink to="/admin-login" onClick={toggleMenu}>
                    <Button className="mt-10 text-2xl">Login</Button>
                  </NavLink>
                ) : (
                  <div className="relative py-2 px-4 w-full text-center">
                    <button
                      onClick={toggleDropdown}
                      className="bg-transparent text-white font-medium text-[15px]"
                    >
                      {userName || "Account"}
                    </button>
                    {dropdownVisible && (
                      <div className="absolute top-0 left-0 w-full bg-white text-black p-4 shadow-lg">
                        <NavLink
                          to="/dashboard"
                          className="block py-2 text-center"
                        >
                          Dashboard
                        </NavLink>
                        <NavLink
                          to="/update-form"
                          className="block py-2 text-center"
                        >
                          Update Profile
                        </NavLink>
                        <button
                          onClick={handleLogout}
                          className="block py-2 w-full text-left text-red-500"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Desktop Menu */}
            <nav className="hidden sm:flex gap-10 items-center">
              <a href="#features" className="cursor-pointer">
                Features
              </a>
              <NavLink to="/business-add-business">Add Business</NavLink>
              <NavLink to="/AboutUs">About Us</NavLink>

              {!isLoggedIn ? (
                <NavLink to="/admin-login">
                  <Button>Login</Button>
                </NavLink>
              ) : (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="bg-transparent text-white font-medium text-[15px]"
                  >
                    {userName || "Account"}
                  </button>
                  {dropdownVisible && (
                    <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg p-2 w-40">
                      <NavLink to="/dashboard" className="block px-4 py-2">
                        Dashboard
                      </NavLink>
                      <NavLink to="/update-form" className="block px-4 py-2">
                        Update Profile
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-500"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
