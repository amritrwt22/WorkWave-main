import React from 'react';
import RootLayout from './RootLayout';
import Header from './components/Header';
import Hero from './components/Hero';
import LogoTicker from './components/LogoTicker';
import ProductShowcase from './components/ProductShowcase';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';


function UserLandingPage() {
  return (
    <RootLayout>
      <Header/>
      <Hero/>
      <LogoTicker/>
      <ProductShowcase/>
      <Testimonials/>
      <Footer/>
    </RootLayout>
  );
}

export default UserLandingPage;
