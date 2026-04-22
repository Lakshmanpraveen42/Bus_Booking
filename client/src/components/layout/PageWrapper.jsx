import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Standard page wrapper: Header + main content + Footer.
 * Use noFooter for fullscreen pages like confirmation.
 */
const PageWrapper = ({ children, noFooter = false, isTransparent = false, className = '' }) => (
  <div className="min-h-screen flex flex-col bg-background">
    <Header />
    <main className={['flex-1', !isTransparent && 'pt-16', className].join(' ')}>
      {children}
    </main>
    {!noFooter && <Footer />}
  </div>
);

export default PageWrapper;
