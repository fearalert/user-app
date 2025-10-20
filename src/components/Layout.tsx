/** @format */
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUI } from '../hooks/useUI';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useUI();
  return (
    <div
      data-theme={theme}
      className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 bg-base-100">{children}</main>
      </div>
    </div>
  );
}
