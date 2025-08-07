import React, { useState, useEffect } from "react";
import ButtonGradient from "../assets/ButtonGradient";
// import { ReactComponent as ArrowRight } from '../assets/arrow-right.svg';
import Logo from "../assets/logosaas.png";
// import { ReactComponent as MenuIcon } from '../assets/menu.svg';
import { NavLink } from "react-router-dom";
import Button from "./New_button"

const Header = () => {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 ${
        scroll ? "bg-[#0E0C17]" : "bg-[#0E0C17]"
      } transition-colors text-white `}
    >
      {/* <div className='flex justify-center items-center py-3 bg-black text-white text-sm gap-3'>
        <p className='text-white/60 hidden md:block'>Streamline your workflow and boost your productivity</p>
        <div className='inline-flex gap-1 items-center'>
          <p>Get Started for free</p>
          <ArrowRight className='h-4 w-4 inline-flex justify-center items-center '/>
        </div>
      </div> */}
      <div className="py-3 flex justify-center items-center bg-black text-white text-sm gap-3 ">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex justify-center items-center">
              {/* <img src={Logo} alt="saaslogo" height={40} width={40} />
              <h1 className="font-bold text-[1.4rem] ml-1">WorkWave</h1> */}
            </div>
            {/* <MenuIcon className='h-5 w-5 md:hidden' /> */}
            <nav className="hidden md:flex gap-10 text-white/60 items-center">
              <NavLink to="/">Home</NavLink>
              {/* <NavLink to="/BusinessList">Services</NavLink> */}
              <NavLink to="/businessForm">Add Business</NavLink>
              <a href="#customer">Testimonials</a>
              <a href="#help">Help</a>
              <NavLink to="/loginAdmin">
                {/* <button className="bg-white text-black px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight">
                  Login
                </button> */}
                <Button>Login</Button>
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
      <ButtonGradient/>
    </header>
  );
};

export default Header;
