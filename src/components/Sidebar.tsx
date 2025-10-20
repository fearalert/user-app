/** @format */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Settings,
  Folder,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  subNav?: { name: string; path: string }[];
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
  {
    name: 'Users',
    icon: <User size={18} />,
    subNav: [
      { name: 'All Users', path: '/users' },
      { name: 'Favourites', path: '/favourites' },
    ],
  },
  { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={`h-screen bg-base-200 shadow-md flex flex-col transition-width duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}>
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        {!collapsed && <span className="text-xl font-bold">Users App</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-ghost btn-sm p-1">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col">
            <Link
              to={item.path || '#'}
              className={`flex items-center gap-2 p-3 hover:bg-base-300 ${
                location.pathname === item.path
                  ? 'bg-base-300 font-semibold'
                  : ''
              }`}>
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
            {!collapsed &&
              item.subNav?.map((sub, i) => (
                <Link
                  key={i}
                  to={sub.path}
                  className={`ml-8 block p-2 text-sm hover:bg-base-300 ${
                    location.pathname === sub.path
                      ? 'bg-base-300 font-semibold'
                      : ''
                  }`}>
                  {sub.name}
                </Link>
              ))}
          </div>
        ))}
      </nav>
    </div>
  );
}
