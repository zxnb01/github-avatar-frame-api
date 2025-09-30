import React, { FC, useState } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';

// --- Constants ---
// Updated to use the requested stylized text
const STYLIZED_APP_NAME = 'A̺͆v̺͆a̺t̺a̺r̺͆ F̺r̺a̺m̺e̺͆ A̺͆P̺͆I̺͆'; 
const DOCS_URL = 'https://github.com/TechQuanta/github-avatar-frame-api';
const COMMUNITY_URL = '#'; // Placeholder for community link
const COMMUNITY_BUTTON_TEXT = '𝕺𝖕𝖊𝖓 𝕮𝖔𝖒𝖒𝖚𝖓𝖎𝖙𝖞';

/**
 * Responsive Navigation Bar Component.
 * Fixed, transparent, and includes responsive hamburger menu logic.
 */
const Nav: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "How to Use", href: "#how-to-use" },
        { name: "Documentation", href: DOCS_URL, isExternal: true },
    ];

    return (
        // Navbar Container: Changed background to transparent, removed blur and border
        <nav className="fixed top-0 left-0 w-full z-50 bg-transparent shadow-none transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* LEFT ALIGNED GROUP: App Title/Logo and Desktop Nav Links */}
                    <div className="flex items-center space-x-8"> 
                        {/* App Title/Logo - Applied NEON style */}
                        <div className="flex items-center">
                            <span className="text-2xl font-extrabold cursor-pointer select-none tracking-wider text-neon">
                                {STYLIZED_APP_NAME}
                            </span>
                        </div>

                        {/* Desktop Nav Links - Applied NEON hover effect */}
                        <div className="hidden md:flex space-x-6 lg:space-x-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target={link.isExternal ? "_blank" : "_self"}
                                    rel={link.isExternal ? "noopener noreferrer" : ""}
                                    className="text-gray-400 text-sm font-medium tracking-wide transition duration-200 flex items-center gap-1 text-neon-hover"
                                >
                                    {link.name}
                                    {link.isExternal && <ExternalLink className="w-3 h-3 ml-0.5" />}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Open Community Button & Mobile Menu Button */}
                    <div className="flex items-center space-x-4">
                        {/* Open Community Button: Added subtle neon glow effect (btn-neon-glow) */}
                        <a
                            href={COMMUNITY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                px-4 py-2 text-sm font-semibold text-black 
                                bg-white rounded-full transition duration-300 ease-in-out btn-neon-glow
                                hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/50 
                                flex items-center gap-2
                            "
                            title="Open Community"
                        >
                            {COMMUNITY_BUTTON_TEXT}
                        </a>

                        {/* Mobile Menu Button - Applied NEON hover effect */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-300 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition text-neon-hover"
                            aria-label="Toggle navigation menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Content (Using transparent background for a cleaner look) */}
            {isMenuOpen && (
                <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-t border-white/10 animate-fadeDown">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-200"
                        >
                            {link.name}
                        </a>
                    ))}
                    {/* Mobile Community Button - Kept separate styling for clarity in mobile menu */}
                    <a
                        href={COMMUNITY_URL}
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-2 text-center w-full block px-3 py-2 bg-indigo-600 text-white rounded-md text-base font-semibold hover:bg-indigo-500 transition duration-200 flex items-center justify-center gap-2"
                    >
                        <ExternalLink className="w-4 h-4" />
                        {COMMUNITY_BUTTON_TEXT}
                    </a>
                </div>
            )}

             {/* Custom CSS for Neon Glow and Animation */}
             <style>{`
                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeDown { animation: fadeDown 0.3s ease-out forwards; }
                
                /* Neon Glow Definition */
                .text-neon {
                    color: #67e8f9; /* Bright Cyan */
                    text-shadow: 
                        0 0 4px rgba(103, 232, 249, 0.7), /* subtle inner glow */
                        0 0 10px rgba(103, 232, 249, 0.7), /* main glow */
                        0 0 16px rgba(103, 232, 249, 0.5); /* wider glow */
                }

                .text-neon-hover:hover {
                    color: #38bdf8; /* Brighter Blue */
                    text-shadow: 
                        0 0 4px rgba(56, 189, 248, 0.9), 
                        0 0 12px rgba(56, 189, 248, 0.9);
                }

                .btn-neon-glow {
                    /* Applying a neon box shadow to the white button */
                    box-shadow: 0 0 10px rgba(103, 232, 249, 0.7); 
                }
             `}</style>
        </nav>
    );
};

// --- Main App Component ---
const App: FC = () => {
    return (
        // Outer container background is transparent
        <div className="min-h-screen bg-transparent font-sans">
            <Nav />
            
            {/* Main section is kept empty */}
            <main className="pt-16">
            </main>
        </div>
    );
};

export default App;
