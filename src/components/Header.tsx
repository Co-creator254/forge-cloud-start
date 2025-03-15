
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/"
          className="font-medium text-2xl tracking-tight focus:outline-none"
        >
          <span className="text-primary">Agri</span>
          <span className="text-soil-600">Tender</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" active={location.pathname === "/"}>Home</NavLink>
          <NavLink to="/#agricultural-issues" active={location.hash === "#agricultural-issues"}>Agricultural Issues</NavLink>
          <NavLink to="/#tender-opportunities" active={location.hash === "#tender-opportunities"}>Tender Opportunities</NavLink>
          <NavLink to="/#supply-chain-jobs" active={location.hash === "#supply-chain-jobs"}>Supply Chain Jobs</NavLink>
          <NavLink to="/#contact" active={location.hash === "#contact"}>Contact</NavLink>
          <Button variant="outline" size="icon" className="ml-2">
            <Search className="h-5 w-5" />
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-primary"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-4 px-6 space-y-4 animate-fade-in">
          <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
          <MobileNavLink to="/#agricultural-issues" onClick={() => setIsMobileMenuOpen(false)}>Agricultural Issues</MobileNavLink>
          <MobileNavLink to="/#tender-opportunities" onClick={() => setIsMobileMenuOpen(false)}>Tender Opportunities</MobileNavLink>
          <MobileNavLink to="/#supply-chain-jobs" onClick={() => setIsMobileMenuOpen(false)}>Supply Chain Jobs</MobileNavLink>
          <MobileNavLink to="/#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</MobileNavLink>
          <div className="pt-2">
            <Button className="w-full justify-start" variant="outline">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active?: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active = false, children }) => (
  <Link
    to={to}
    className={cn(
      "text-base font-medium hover:text-primary relative py-1",
      active 
        ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full" 
        : "text-foreground/80"
    )}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps {
  to: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-lg font-medium text-foreground/80 hover:text-primary"
  >
    {children}
  </Link>
);

export default Header;
