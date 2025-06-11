
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';
import { UserAvatar } from '@/components/UserAvatar';
import { MainNav } from '@/components/MainNav';
import { MobileNav } from '@/components/MobileNav';
import NotificationCenter from '@/components/NotificationCenter';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search functionality could go here */}
          </div>
          <nav className="flex items-center space-x-2">
            {user && <NotificationCenter />}
            <ModeToggle />
            {user ? (
              <UserAvatar />
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
