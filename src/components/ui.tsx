import React, { FC, useState, useRef, useCallback, useMemo, useEffect } from 'react';

// --- API Configuration ---
const BASE_API_URL = 'https://github-avatar-frame-api.vercel.app';
const DEFAULT_USERNAME = 'octocat'; 
const SWARM_THEME = 'neon'; 
const SWARM_SIZE = '64'; 

// --- 3D Effect Constants ---
const MAX_TILT = 60; 
const INFLUENCE_RADIUS = 300; 

// --- Swarm Grid Setup ---
const COLS = 12;
const ROWS = 8;
const H_STEP = 100 / COLS; 
const V_STEP = 100 / ROWS; 

const logoPositions = Array.from({ length: COLS * ROWS }).map((_, i) => ({
    left: (i % COLS) * H_STEP + (H_STEP / 2), 
    top: Math.floor(i / COLS) * V_STEP + (V_STEP / 2),
}));

// --- Digital Rain Setup ---

/**
 * Generates a string composed purely of random '0's and '1's.
 */
const generateBinaryString = (length: number): string => {
    let s = '';
    for (let i = 0; i < length; i++) {
        s += Math.random() < 0.5 ? '0' : '1'; 
    }
    return s;
};

const generateRainColumns = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        left: 0.5 + Math.random() * 99, 
        duration: 10 + Math.random() * 15, 
        delay: Math.random() * 20, 
        content: generateBinaryString(50 + Math.floor(Math.random() * 20)),
    }));
};
const rainColumns = generateRainColumns(80); 

/**
 * Main Background Component: The interactive avatar pattern and glowing blobs.
 */
const BackgroundSwarm: FC = () => {
    // State to track the mouse position relative to the container
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    // State to store the container's dimensions (calculated only on mount/resize)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

    // Dynamic Avatar URL (memoized to run only once)
    const dynamicAvatarUrl = useMemo(() => {
        const username = DEFAULT_USERNAME; 
        const path = `/api/framed-avatar/${username}?theme=${SWARM_THEME}&size=${SWARM_SIZE}`;
        return `${BASE_API_URL}${path}`;
    }, []); 

    // --- EFFECT: Calculate Dimensions on Mount and Resize ---
    // This runs the expensive DOM read only when necessary, not on every mouse move.
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                // We use setDimensions to update the state, which is now used in the render loop
                setDimensions({ width: rect.width, height: rect.height });
            }
        };

        updateDimensions(); // Initial call on mount

        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []); // Empty dependency array: runs only on mount/unmount.

    // Mouse Move Handler (Memoized)
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // NOTE: We still need to call getBoundingClientRect here to get the new offset if the window scrolled,
            // but the state update below only happens once per animation frame by default due to React batching.
            // The key is that the render logic below now uses the stable 'dimensions' state instead of recalculating.
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    }, []);
    
    // De-structure dimensions for cleaner usage in the loop
    const { width: containerWidth, height: containerHeight } = dimensions;
    
    return (
        <div 
            ref={containerRef}
            className="w-full h-full flex items-center justify-center text-white font-sans relative overflow-hidden bg-gray-900" 
            onMouseMove={handleMouseMove}
        >
            
            {/* --- DIGITAL RAIN LAYER (Z-index 1) --- */}
            {rainColumns.map((col, index) => (
                <div
                    key={index}
                    className="absolute text-cyan-500 font-mono text-sm pointer-events-none digital-rain"
                    style={{
                        left: `${col.left}vw`,
                        animationDuration: `${col.duration}s`,
                        animationDelay: `${col.delay}s`,
                    }}
                >
                    {col.content}
                </div>
            ))}

            {/* --- Blob Containers (Non-interactive, Z-index 1) --- */}
            <div className="absolute blob-base blob-right"></div>
            <div className="absolute blob-base blob-left-bottom"></div>

            {/* --- Interactive Avatars (Z-index 3) --- */}
            {logoPositions.map((pos, index) => {
                let tiltX = 0;
                let tiltY = 0;
                
                // Use the memoized 'dimensions' state instead of recalculating them
                if (containerWidth > 0) {
                    const logoX = (pos.left / 100) * containerWidth;
                    const logoY = (pos.top / 100) * containerHeight;

                    const deltaX = mousePos.x - logoX; 
                    const deltaY = mousePos.y - logoY; 
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const influenceFactor = 1 - clamp(distance / INFLUENCE_RADIUS, 0, 1);
                    
                    const rotY = -(deltaX / distance) * MAX_TILT * influenceFactor; 
                    const rotX = (deltaY / distance) * MAX_TILT * influenceFactor; 

                    tiltY = isNaN(rotY) ? 0 : rotY;
                    tiltX = isNaN(rotX) ? 0 : rotX;
                }

                return (
                    <div
                        key={index}
                        className="absolute mini-logo-container select-none pointer-events-none"
                        style={{
                            left: `${pos.left}%`,
                            top: `${pos.top}%`,
                            transform: `
                                translate(-50%, -50%)
                                perspective(500px) 
                                rotateX(${tiltX}deg) 
                                rotateY(${tiltY}deg)
                            `,
                            transition: 'transform 0.1s linear', 
                            transformStyle: 'preserve-3d', 
                        }}
                    >
                        <img 
                            src={dynamicAvatarUrl} 
                            alt={`Framed avatar for ${DEFAULT_USERNAME}`} 
                            className="w-12 h-12 opacity-[0.6] mini-logo-neon rounded-full" 
                            onError={(e) => { 
                                e.currentTarget.onerror = null; 
                                e.currentTarget.src = `https://github.com/${DEFAULT_USERNAME}.png?size=64`; 
                                e.currentTarget.classList.remove('rounded-full'); 
                                e.currentTarget.classList.add('p-1', 'bg-cyan-900'); 
                            }}
                        />
                    </div>
                );
            })}

            {/* Custom CSS */}
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-100vh); opacity: 0.01; } 
                    50% { opacity: 0.04; }
                    100% { transform: translateY(100vh); opacity: 0.01; } 
                }
                .digital-rain {
                    animation: fall linear infinite;
                    opacity: 0.03; 
                    text-shadow: 0 0 5px rgba(103, 232, 249, 0.3);
                    z-index: 1; 
                    white-space: pre; 
                }
                .mini-logo-neon {
                    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8)) 
                                 drop-shadow(0 0 5px #67e8f9) 
                                 drop-shadow(0 0 10px rgba(103, 232, 249, 0.5));
                    transition: opacity 0.5s;
                }
                .mini-logo-container {
                    z-index: 3;
                }
                @keyframes glow-pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 0.95; } 
                    100% { transform: scale(1); opacity: 0.8; }
                }
                .blob-base {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(700px); 
                    opacity: 0.8; 
                    animation: glow-pulse 6s infinite ease-in-out alternate;
                    z-index: 1; 
                }
                .blob-right {
                    width: 650px; height: 650px; top: -150px; right: -200px; 
                    transform: none; 
                    background: radial-gradient(circle, rgba(103, 232, 249, 1.0), rgba(103, 232, 249, 0) 70%); 
                    animation-delay: 1s; 
                }
                .blob-left-bottom {
                    width: 500px; height: 500px; bottom: -150px; left: -150px;
                    background: radial-gradient(circle, rgba(244, 114, 182, 1.0), rgba(244, 114, 182, 0) 70%); 
                    animation-duration: 4s; 
                    animation-delay: 2s;
                }
                body {
                    /* Ensures the body takes up full height and hides scrollbars, which is good for a background effect */
                    height: 100vh;
                    margin: 0;
                    overflow: hidden;
                    background-color: #0d0d0d;
                }
                #root {
                    height: 100%;
                }
            `}</style>
        </div>
    );
};

export default BackgroundSwarm;
