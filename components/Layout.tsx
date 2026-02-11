import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TaoCanvas from './TaoCanvas';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path ? "text-accent-gold" : "text-gray-300 hover:text-accent-gold";

    return (
        <div className="relative bg-mystical-gradient text-white font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white overflow-x-hidden">
            
            {/* Global Ambient Background Effects */}
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow z-0"></div>
            <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow z-0" style={{ animationDelay: '2s' }}></div>

            <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-4 group cursor-pointer">
                        {/* Animated Logo Container */}
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            {/* Inner Tao - Increased size */}
                            <div className="relative w-10 h-10 z-10 transition-transform duration-700 group-hover:rotate-180">
                                <TaoCanvas />
                            </div>
                        </div>

                        <span className="text-white font-serif tracking-widest text-lg font-bold group-hover:text-accent-gold transition-colors duration-300">
                            I CHING HOME
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/book" className={`text-sm font-medium transition-colors duration-300 ${isActive('/book')}`}>
                            The Book
                        </Link>
                         <Link to="/oracle" className={`text-sm font-medium transition-colors duration-300 ${isActive('/oracle')}`}>
                            Oracle
                        </Link>
                        <Link to="/journal" className={`text-sm font-medium transition-colors duration-300 ${isActive('/journal')}`}>
                            Journal
                        </Link>
                        <button className="px-6 py-2 rounded border border-white/20 text-white text-sm font-bold tracking-wide hover:bg-white hover:text-background-dark transition-all duration-300">
                            Sign In
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-white"
                    >
                        <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-background-dark border-b border-white/10 p-4 flex flex-col gap-4 shadow-xl animate-fade-in">
                        <Link to="/book" onClick={() => setIsMenuOpen(false)} className={`text-sm font-medium ${isActive('/book')}`}>The Book</Link>
                        <Link to="/oracle" onClick={() => setIsMenuOpen(false)} className={`text-sm font-medium ${isActive('/oracle')}`}>Oracle</Link>
                        <Link to="/journal" onClick={() => setIsMenuOpen(false)} className={`text-sm font-medium ${isActive('/journal')}`}>Journal</Link>
                        <button className="px-6 py-2 rounded border border-white/20 text-white text-sm font-bold tracking-wide hover:bg-white hover:text-background-dark transition-all duration-300 w-full">
                            Sign In
                        </button>
                    </div>
                )}
            </nav>

            <main className="relative z-10 flex-grow pt-20 flex flex-col">
                {children}
            </main>
        </div>
    );
};

export default Layout;