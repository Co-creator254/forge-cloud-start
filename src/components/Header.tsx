import React from 'react';
import { Link } from 'react-router-dom';
import { ModeToggle } from '@/components/ModeToggle';
import { MainNav } from '@/components/MainNav';
import { MobileNav } from '@/components/MobileNav';
import UserAvatar from './UserAvatar';

const Header: React.FC = () => {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MobileNav />
        <Link to="/" className="hidden sm:flex items-center font-semibold">
          <span className="mr-2">AgriConnect</span>
        </Link>
        <MainNav className="mx-6 hidden space-x-4 sm:block" />
        <div className="flex items-center space-x-2">
          <UserAvatar />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
