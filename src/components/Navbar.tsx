import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/50 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-purple-500 rounded-lg transform rotate-45">
                <div className="absolute inset-0.5 bg-gray-900 rounded">
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">$</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full"></div>
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="h-px w-3 md:w-4 bg-white mr-2"></span>
                <h1 className="text-xl md:text-2xl font-bold">FGC</h1>
                <span className="h-px w-3 md:w-4 bg-white ml-2"></span>
              </div>
              <div className="flex text-xs md:text-base">
                <span className="text-teal-400 font-bold">MONEY</span>
                <span className="text-purple-500 font-bold">MATCH</span>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-teal-400 transition-colors">Home</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Tournaments</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Leaderboard</a>
            <a href="#" className="hover:text-teal-400 transition-colors">About</a>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-teal-400 to-purple-500 text-black font-bold hover:opacity-90 transition-opacity rounded-full">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-teal-400 transition-colors p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-4 px-2 space-y-3 bg-gray-900/95 backdrop-blur-xl absolute top-full left-0 right-0 border-b border-white/10 shadow-xl animate-in slide-in-from-top-2">
            <a href="#" className="block px-3 py-2 rounded-md hover:bg-white/10 hover:text-teal-400 transition-colors">Home</a>
            <a href="#" className="block px-3 py-2 rounded-md hover:bg-white/10 hover:text-teal-400 transition-colors">Tournaments</a>
            <a href="#" className="block px-3 py-2 rounded-md hover:bg-white/10 hover:text-teal-400 transition-colors">Leaderboard</a>
            <a href="#" className="block px-3 py-2 rounded-md hover:bg-white/10 hover:text-teal-400 transition-colors">About</a>
            <div className="pt-2">
              <Link to="/login" className="block w-full" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-teal-400 to-purple-500 text-black font-bold hover:opacity-90 transition-opacity rounded-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
