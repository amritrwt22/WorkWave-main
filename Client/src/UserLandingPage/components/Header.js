import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/logosaas.png";
import axios from "axios";
import Cookies from "js-cookie";

const Header = () => {
  // State variables to manage header behavior and user information
  // useState hook is used for rendering the specific part of the component when the state changes

  const [scroll, setScroll] = useState(false); // Track scroll position for header background change
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [userName, setUserName] = useState(""); // Track user name
  const [userRole, setUserRole] = useState(""); // Track user role (user/admin)
  const [dropdownVisible, setDropdownVisible] = useState(false); // Dropdown visibility state
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state
  const navigate = useNavigate(); // useNavigate hook for navigation
  
  // Function to get cookie value by name , cookies are used to store user session information
  const getCookie = (name) => {
    return Cookies.get(name); // Using js-cookie to get cookies
  };

  const fetchInfo = async () => {
    try {
      const token = getCookie("token");
      const role = getCookie("role");

      if (!token || !role) {
        setIsLoggedIn(false); // If no token or role, set logged out state
        return;
      }

      // Make the API call to fetch user information based on the token
      const response = await axios.get(
        "http://localhost:3002/user/user-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // If response data is available, set the user name, role, and logged-in state
      if (response.data && response.data.name) {
        setUserName(response.data.name);
        setUserRole(role); // Set user role from cookie
        setIsLoggedIn(true); // Update login state after successful data fetch
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setIsLoggedIn(false); // On error, set logged out state
    }
  };

  useEffect(() => {
    // On mount, check if there's a token and role on cookies
    const token = getCookie("token");
    const role = getCookie("role");

    if (token && role) {
      setIsLoggedIn(true);
      fetchInfo(); // Fetch user info only if token exists
    } else {
      setIsLoggedIn(false); // If no token or role, set logged out state
    }

    // Handle scroll behavior
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll); // Add scroll event listener to change header background on scroll

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  const handleLogout = () => {
    // Clear cookies and set logged-out state
    Cookies.remove("token");
    Cookies.remove("role");
    setIsLoggedIn(false);
    setUserRole(""); // Clear user role
    navigate("/user-landingpage");
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };
  
  // Function to toggle mobile menu visibility and manage scroll behavior
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Toggle mobile menu

    // Block/Enable scroll based on menu state
    if (isMenuOpen) {
      document.body.style.overflow = "auto"; // Enable scrolling
    } else {
      document.body.style.overflow = "hidden"; // Disable scrolling
    }
  };

  return (
    <header
      className={`sticky top-0 z-20 ${
        scroll ? "bg-[#0E0C17]" : "bg-[#0E0C17]"
      } transition-colors text-white`}
    >
      <div className="py-5 flex justify-center items-center bg-white text-black text-sm gap-3 ">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex justify-center items-center">
              <NavLink to="/user-landingpage" className="flex items-center">
                <img src={Logo} alt="saaslogo" height={40} width={40} />
                <h1 className="font-bold text-[1.4rem] ml-1">WorkWave</h1>
              </NavLink>
            </div>

            {/* Hamburger Icon for mobile */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-black">
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

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="mobile-menu fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex flex-col justify-start items-center text-white text-xl z-10">
                <button
                  onClick={toggleMenu}
                  className="absolute top-5 right-5 text-white text-3xl"
                >
                  &times;
                </button>
                <NavLink
                  to="/user-landingpage"
                  onClick={toggleMenu}
                  className="py-4 px-6 w-full text-center mt-[100px] text-[40px]"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/businesses/allbusinesses"
                  onClick={toggleMenu}
                  className="py-4 px-6 w-full text-center mt-[30px] text-[40px]"
                >
                  Services
                </NavLink>
                <NavLink
                  to="/AboutUs/User"
                  className="py-4 px-6 w-full text-center mt-[30px] text-[40px]"
                >
                  About Us
                </NavLink>
                <a
                  href="#testimonials"
                  onClick={toggleMenu}
                  className="py-4 px-6 w-full text-center mt-[30px] text-[40px]"
                >
                  Testimonials
                </a>

                {/* Show Login or Account based on login state */}
                {!isLoggedIn ? (
                  <NavLink to="/user-login" onClick={toggleMenu}>
                    <button className="bg-white text-black px-4 py-2 rounded-lg font-medium mt-[70px] text-[20px]">
                      Login
                    </button>
                  </NavLink>
                ) : (
                  <div className="relative py-2 px-4 w-full text-center">
                    <button
                      onClick={toggleDropdown}
                      className="bg-transparent text-white font-medium"
                    >
                      <span>{userName || "Account"}</span>
                    </button>
                    {dropdownVisible && (
                      <div className="absolute top-0 left-0 w-full bg-white text-black p-4 shadow-lg">
                        <NavLink
                          to={
                            userRole === "admin"
                              ? "/admin-dashboard"
                              : "/user-dashboard"
                          }
                          className="block py-2 text-center"
                        >
                          Dashboard
                        </NavLink>
                        <NavLink
                          to="/user-update-form"
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

            {/* Desktop menu */}
            <nav className="hidden md:flex gap-10 text-black/75 items-center font-bold">
              <NavLink to="/businesses/allbusinesses">Services</NavLink>
              <NavLink to="/AboutUs/User">About Us</NavLink>
              <a href="#testimonials">Testimonials</a>

              {/* Show Login or Account based on login state */}
              {!isLoggedIn ? (
                <NavLink to="/user-login">
                  <button className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight">
                    Login
                  </button>
                </NavLink>
              ) : (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="bg-transparent text-black font-medium"
                  >
                    <span>{userName || "Account"}</span>
                  </button>
                  {dropdownVisible && (
                    <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg p-2 w-40">
                      <NavLink
                        to={
                          userRole === "admin"
                            ? "/admin-dashboard"
                            : "/user-dashboard"
                        }
                        className="block px-4 py-2"
                      >
                        Dashboard
                      </NavLink>
                      <NavLink
                        to="/user-update-form"
                        className="block px-4 py-2"
                      >
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
