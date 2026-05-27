import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { LeftMenu } from './LeftMenu';
import { Footer } from './Footer';

export const Layout = () => {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-bg-page select-none">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <LeftMenu />
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
