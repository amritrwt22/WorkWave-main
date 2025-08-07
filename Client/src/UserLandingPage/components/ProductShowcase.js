"use client"
import React from 'react'
import productImage from '../assets/product-image.png';
import pyramidImage from '../assets/pyramid.png';
import tubeImage from '../assets/tube.png';
import {motion, useScroll ,useTransform} from 'framer-motion';
import {useRef} from 'react';

const ProductShowcase = () => {
  const sectionRef=useRef(null);
  const {scrollYProgress}=useScroll({
    target:sectionRef,
    offset:['start end','end start']
  })
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  return (
    <section ref={sectionRef} className='bg-gradient-to-b from-[#FFFFFF] to-[#BBA2BE] py-24 overflow-x-clip'> 
        <div className='container'>
        <div className='max-w-[540px] mx-auto'>
        <div className='flex justify-center'>
            <div className='text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight mx-24 text-black'>Boost your bookings</div>
            </div>
            <h2 className='text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#591B5F] text-transparent bg-clip-text mt-5'>A more effective way to track progress of bookings</h2>
            <p className='text-center text-[22px] leading-[30px] tracking-tighy text-[#000000] mt-5 '>Effortlessly make your reservations without waiting in queues.</p>
            </div>
            <div className='relative'>
            <img src={productImage} alt='productimage' className='mt-10 ml-10'/>
            <motion.img src={pyramidImage} alt='pyramid' className='absolute -right-36 -top-32 hidden md:block' height={262} width={262}
            style={{
              translateY,
            }}
            />
            <motion.img src={tubeImage} alt="tube" height={248} width={248} className='absolute bottom-24 -left-36 hidden md:block w' 
            style={{
              translateY,
            }}/>
            </div>
        </div>
    </section>
  )
}

export default ProductShowcase
