'use client';

import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import UserMenu from './user';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react'; // Assuming you're using lucide-react for icons

const Navbar = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogin = () => {
    router.push('/sign-in');
    setIsMenuOpen(false);
  };

  const handleSignUp = () => {
    router.push('/sign-up');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src={logo} alt="Logo" width={70} height={50} />
              <span className="ml-2 text-xl font-bold text-gray-800">IOTechz</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
  const isActive = pathname === item.href;
  if (!user && item.href === '/dashboard') {
    return null;
  }
  return (
    <div className="relative group" key={item.href}>
      <Link
        href={item.href}
        className={`px-3 py-2 text-sm font-medium ${
          isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {item.name}
      </Link>
      <span
        className={`absolute -bottom-1 left-0 h-1 bg-blue-600 transition-all duration-300 w-0 group-hover:w-full`}
      ></span>
    </div>
  );
})}
            {user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="text-gray-600 hover:text-blue-600"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Hamburger Button for Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-12 right-0 left-0 mt-2 sm:hidden sm:h-0 bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              if (!user && item.href === '/dashboard') {
                return null;
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            {user ? (
              <div className="px-3 py-2">
                <UserMenu user={user} />
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-gray-600 hover:text-blue-600"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;