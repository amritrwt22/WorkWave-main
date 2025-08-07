'use client';
import React from 'react';
import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";
import avatar5 from "../assets/avatar-5.png";
import avatar6 from "../assets/avatar-6.png";
import avatar7 from "../assets/avatar-7.png";
import avatar8 from "../assets/avatar-8.png";
import avatar9 from "../assets/avatar-9.png";
import { motion } from 'framer-motion';

const testimonials = [
  {
    text: "As a seasoned designer always on the lookout for innovative tools, Framer.com instantly grabbed my attention.",
    imageSrc: avatar1,
    name: "Jamie Rivera",
    username: "@jamietechguru00",
  },
  {
    text: "Our team's productivity has skyrocketed since we started using this tool.",
    imageSrc: avatar2,
    name: "Josh Smith",
    username: "@jjsmith",
  },
  {
    text: "This app has completely transformed how I manage my projects and deadlines.",
    imageSrc: avatar3,
    name: "Morgan Lee",
    username: "@morganleewhiz",
  },
  {
    text: "I was amazed at how quickly we were able to integrate this app into our workflow.",
    imageSrc: avatar4,
    name: "Casey Jordan",
    username: "@caseyj",
  },
  {
    text: "Planning and executing events has never been easier. This app helps me keep track of all the moving parts, ensuring nothing slips through the cracks.",
    imageSrc: avatar5,
    name: "Taylor Kim",
    username: "@taylorkimm",
  },
  {
    text: "The customizability and integration capabilities of this app are top-notch.",
    imageSrc: avatar6,
    name: "Riley Smith",
    username: "@rileysmith1",
  },
  {
    text: "Adopting this app for our team has streamlined our project management and improved communication across the board.",
    imageSrc: avatar7,
    name: "Jordan Patels",
    username: "@jpatelsdesign",
  },
  {
    text: "With this app, we can easily assign tasks, track progress, and manage documents all in one place.",
    imageSrc: avatar8,
    name: "Sam Dawson",
    username: "@dawsontechtips",
  },
  {
    text: "Its user-friendly interface and robust features support our diverse needs.",
    imageSrc: avatar9,
    name: "Casey Harper",
    username: "@casey09",
  },
];

const TestimonialsColumn = ({ className, testimonials, duration }) => (
  <div className={className}>
     <motion.div
      animate={{ translateY: ["0%", "-100%"] }} 
      transition={{
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
        duration: duration || 10,
      }}
      className="flex flex-col gap-6"
    >
      {testimonials.map(({ text, imageSrc, name, username }, i) => (
        <div key={`${username}-${i}`} className="p-10 border border-solid border-[#222222]/10 rounded-3xl shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full">
          <div className="text-black">Test Text: {text}</div> {/* Test Text added for debugging */}
          <div className="flex items-center gap-2 mt-5">
            <img src={imageSrc} alt={name} width={40} height={40} className="h-10 w-10 rounded-full" />
            <div className="flex flex-col text-black"> {/* Changed to red for visibility */}
              <div className="font-medium tracking-tight leading-5">{name}</div>
              <div className="leading-5 tracking-tight">{username}</div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="bg-white" id='testimonials'>
      <div className="container mx-auto">
        {/* Section heading */}
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight text-black">Testimonials</div>
          </div>
          {/* Section title */}
          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#591B5F] text-transparent bg-clip-text mt-5">
            What our users say
          </h2>
          {/* Description */}
          <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#000000] mt-5">
            From intuitive design to powerful features, our app has become an essential tool for users around the world.
          </p>
        </div>
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] mt-10 max-h-[738px] overflow-hidden">
          <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={15} />
          <TestimonialsColumn testimonials={testimonials.slice(3, 6)} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={testimonials.slice(6, 9)} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
