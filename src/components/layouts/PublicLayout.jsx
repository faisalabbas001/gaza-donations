import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../common/Footer';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;