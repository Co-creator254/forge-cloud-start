
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MainNavigation from '@/components/MainNavigation';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link to="/" className="flex items-center">
                  <span className="text-xl font-bold">AgriTender Connect</span>
                </Link>
              </div>
              <div className="mt-6 px-2">
                <MainNavigation />
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">AgriTender Connect</span>
          </Link>
          
          <nav className="hidden md:flex md:gap-2">
            <MainNavigation />
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/api-docs">API Docs</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/commodity-trading">Trade Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
