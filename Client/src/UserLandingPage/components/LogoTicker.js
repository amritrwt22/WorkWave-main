'use client'
import React from 'react';
import acmeLogo from '../assets/logo-acme.png';
import quantumLogo from '../assets/logo-quantum.png';
import echoLogo from '../assets/logo-echo.png';
import celestialLogo from '../assets/logo-celestial.png';
import pulseLogo from '../assets/logo-pulse.png';
import apexLogo from '../assets/logo-apex.png';
import {motion} from 'framer-motion';

const LogoTicker = () => {
  return (
    <div className='py-8 bg-white md:py-12'>
      <div className='container'>
        <div className='flex overflow-hidden' style={{ maskImage: 'linear-gradient(to right, transparent, black, transparent)' }}>
          <motion.div className='flex gap-14 flex-none pr-14' animate={{
            translateX:"-50%",
          }}
          transition={{
            duration:20,
            repeat:Infinity,
            ease:"linear",
            repeatType:'loop', 
          }}
          >
            <img src={acmeLogo} alt="Acme Logo" className='h-8 w-auto'/>
            <img src={quantumLogo} alt="Quantum Logo"/>
            <img src={echoLogo} alt="Echo Logo"/>
            <img src={celestialLogo} alt="Celestial Logo"/>
            <img src={pulseLogo} alt="Pulse Logo"/>
            <img src={apexLogo} alt="Apex Logo"/>

            <img src={acmeLogo} alt="Acme Logo" className='h-8 w-auto'/>
            <img src={quantumLogo} alt="Quantum Logo"/>
            <img src={echoLogo} alt="Echo Logo"/>
            <img src={celestialLogo} alt="Celestial Logo"/>
            <img src={pulseLogo} alt="Pulse Logo"/>
            <img src={apexLogo} alt="Apex Logo"/>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LogoTicker;
