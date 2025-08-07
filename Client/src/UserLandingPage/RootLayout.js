import React from 'react';
import { Helmet } from 'react-helmet';
import { twMerge } from 'tailwind-merge';
// import './index.css';

const dmSansClassName = 'font-dm-sans'; // Ensure this is defined in your CSS (globals.css).

export const metadata = {
  title: 'WorkWave',
  description: 'Template created by Frontend Tribe',
};

export default function RootLayout({ children }) {
  return (
    <div className={twMerge(dmSansClassName, 'relative antialiased bg-[#EAEEFE]')}>
      <Helmet>
        <html lang="en" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>
      {children}
    </div>
  );
}
