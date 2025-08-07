import React, { useEffect, useState } from "react";
// import BoomerangVideo from "./Boomerang1";
import myVideo from './vid.mp4';
import { NavLink } from "react-router-dom";
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation after the component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      {/* Video Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          className="w-full h-full object-cover"
          source src={myVideo} type="video/mp4"
          autoPlay
          loop
          muted
        ></video>
        
        {/* <BoomerangVideo/> */}
      </div>

      

      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        // style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Text Content with Animation */}
      <div
        className={`absolute inset-0 flex items-center justify-center text-white text-center z-10 transition-all duration-1000 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div>
          <h1 className="text-4xl font-bold mb-4">Make Your Plans Happen</h1>
          <p className="text-xl">Start now and access exclusive deals from trusted small businesses.</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;




