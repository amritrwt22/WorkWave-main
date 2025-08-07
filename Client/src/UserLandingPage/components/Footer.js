import React from 'react';
import logo from "../assets/logosaas.png";
import { ReactComponent as SocialX } from '../assets/social-x.svg';
import { ReactComponent as SocialInsta } from '../assets/social-insta.svg';
import { ReactComponent as SocialLinkedIn } from '../assets/social-linkedin.svg';
import { ReactComponent as SocialPin } from '../assets/social-pin.svg';
import { ReactComponent as SocialYoutube } from '../assets/social-youtube.svg';

const Footer = () => {
    return (
        <footer className='bg-black text-[#BCBCBC] text-sm py-10 text-center mt-10'>
            <div className='container'>
                <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:blur  before:bg-gradient-to-r before:from-[#F87BFF] before:via-[#FB92CF] before:via-[#FFDD9B] before:via-[#C2F0B1] before:to-[#2FD8FE] before:absolute">
                    <img src={logo} height={20} alt='logo' className='relative'/>
                </div>
                <nav className='flex flex-col gap-6 mt-6 md:flex-row md:justify-center'>
                    <a href="#about">About</a>
                    <a href="#features">Features</a>
                    <a href="#customers">Customers</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#help">Help</a>
                    <a href="#careers">Careers</a>
                </nav>
                <div className='flex justify-center gap-6 mt-6'>
                    <SocialX />
                    <SocialInsta />
                    <SocialLinkedIn />
                    <SocialPin />
                    <SocialYoutube />
                </div>
                <p className='mt-6'>&copy; 2024 Your Company, Inc. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
