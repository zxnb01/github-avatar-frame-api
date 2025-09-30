import React, { FC, useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';

// --- Configuration ---
const GITHUB_REPO = 'TechQuanta/github-avatar-frame-api';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contributors`;
const MAX_CONTRIBUTORS = 10; 

// --- Constants for Centering and Sizing ---
const SVG_SIZE = 400; 
const SVG_WIDTH = SVG_SIZE;
const SVG_HEIGHT = SVG_SIZE; 
// Avatars rest their bottom edge here.
const FLOOR_Y = 350; 
const AVATAR_SIZE = 30;
const AVATAR_RADIUS = AVATAR_SIZE / 2;
const SPACING = 40; // Horizontal spacing between the avatars

// --- Bucket Dimensions (Base Size) ---
const BUCKET_W_BASE = 300;
const BUCKET_H_BASE = 310; // Sets the base top edge position (350 - 310 = 40)

// --- Types ---
interface Contributor {
    id: number;
    login: string;
    avatar_url: string; 
    html_url: string;
}

interface MousePos {
    x: number;
    y: number;
}

interface DynamicBucketProps {
    W_FINAL: number;
    X_FINAL: number;
    Y_FINAL: number;
}

// --- Components ---

/**
 * Single Contributor Avatar with chaotic vertical and horizontal bouncing animation inside the bucket.
 */
const ContributorBall: FC<{ contributor: Contributor, index: number, total: number, isHovered: boolean, mousePos: MousePos, strokeColor: string } & DynamicBucketProps> = ({ contributor, index, total, isHovered, W_FINAL, X_FINAL, Y_FINAL, strokeColor }) => {
    
    // State to force re-evaluation of random movement variables every few seconds
    const [randomSeed, setRandomSeed] = useState(0);

    // Effect to update the random seed periodically
    useEffect(() => {
        // Only run the random update if not hovered, to prevent jumps during inspection
        if (!isHovered) {
             const interval = setInterval(() => {
                // Update the seed with a new random number
                setRandomSeed(Math.random()); 
            }, 4000); // Update roughly every 4 seconds (max duration of jump is ~5s)

            return () => clearInterval(interval);
        }
    }, [isHovered]);

    // Static variables (only changes on mount)
    const duration = `${(3.5 + (index % 4) * 0.5).toFixed(1)}s`; 
    const delay = `${(index * 0.1).toFixed(2)}s`; 
    const maxJump = 150 + (index % 5) * 30; 
    
    // --- Dynamic Chaotic Variables (Changes on every randomSeed update) ---
    const hShift = 70 + (randomSeed * 100); // 70px to 170px horizontal shift
    const rotation = 30 + (randomSeed * 60); // 30deg to 90deg rotation
    const hSign = Math.random() > 0.5 ? 1 : -1;
    const rSign = Math.random() > 0.5 ? 1 : -1;


    // --- Resting Position Logic (Top-Left Corner for the <image> tag) ---
    const totalGroupWidth = total * SPACING;
    const centerOffset = (SVG_WIDTH / 2) - (totalGroupWidth / 2);
    
    // Calculate the resting position (Top-left corner of the 30x30 image at the floor)
    const xTLRest = centerOffset + (index * SPACING) - AVATAR_RADIUS; 
    const yTLRest = FLOOR_Y - AVATAR_SIZE; 

    // --- Dynamic Styles and Transforms ---
    const style = useMemo(() => {
        const baseStyle = {
            '--max-jump': `-${maxJump}px`,
            '--h-shift': `${hSign * hShift}px`,
            '--rotation': `${rSign * rotation}deg`,
            
            // Neon color based on ID
            '--neon-color': `hsl(${contributor.id * 15 % 360}, 100%, 70%)`,
            // Stronger glow on hover/static state
            filter: isHovered ? `drop-shadow(0 0 6px var(--neon-color)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))` : `drop-shadow(0 0 4px var(--neon-color))`,
            transformOrigin: 'center',
            // Increase transition duration for smoothness for the grid snap
            transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), filter 0.3s ease-in-out',
        } as React.CSSProperties;

        if (isHovered) {
            // --- GRID ARRANGEMENT LOGIC (Max 5 columns) ---
            const gridCols = Math.min(total, 5); 
            const gridRows = Math.ceil(total / gridCols);
            const col = index % gridCols;
            const row = Math.floor(index / gridCols);

            // Define inner padding for the grid
            const PADDING = 25; 
            const innerXStart = X_FINAL + PADDING;
            const innerYStart = Y_FINAL + PADDING;
            
            const innerWidth = W_FINAL - (PADDING * 2);
            const innerHeight = FLOOR_Y - innerYStart - PADDING;
            
            // Calculate step distance (ensures even spacing)
            const xStep = innerWidth / (gridCols > 1 ? gridCols - 1 : 1);
            const yStep = innerHeight / (gridRows > 1 ? gridRows - 1 : 1);

            // Target center position for the avatar in the grid
            const targetXCenter = innerXStart + col * xStep;
            const targetYCenter = innerYStart + row * yStep;

            // Translate from resting position (xTLRest, yTLRest) to the target position
            const targetXTL = targetXCenter - AVATAR_RADIUS;
            const targetYTL = targetYCenter - AVATAR_RADIUS;
            
            const translateGridX = targetXTL - xTLRest;
            const translateGridY = targetYTL - yTLRest;
            
            // Apply scale up for "showcase" effect
            baseStyle.transform = `translate(${translateGridX}px, ${translateGridY}px) rotate(0deg) scale(1.1)`;
            baseStyle.animationName = 'none'; // Stop CSS animation
            
        } else {
            // Jumping Logic: Reapply chaotic CSS animation
            baseStyle.animationName = 'chaoticBounce';
            baseStyle.animationDuration = duration;
            baseStyle.animationDelay = delay;
            baseStyle.animationIterationCount = 'infinite';
            baseStyle.animationDirection = 'alternate';
            baseStyle.transform = 'translate(0, 0) rotate(0deg) scale(1)'; 
            baseStyle.transitionDuration = '0.0s'; // Instant restart of animation
        }

        return baseStyle;
    }, [isHovered, randomSeed, contributor, index, total, duration, delay, maxJump, hShift, rotation, xTLRest, yTLRest, hSign, rSign, W_FINAL, X_FINAL, Y_FINAL]);

    const className = isHovered ? "contributor-avatar" : "contributor-avatar chaoticBounce-animation";
    
    // Position for the floating text (center of avatar, 5px above)
    const textX = xTLRest + AVATAR_RADIUS;
    const textY = yTLRest - 5; 

    return (
        <a 
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            title={`@${contributor.login}`}
        >
            {/* 1. Define a clipPath for the circular avatar shape */}
            <defs>
                <clipPath id={`avatarClip-${contributor.id}`}>
                    <circle 
                        cx={xTLRest + AVATAR_RADIUS} 
                        cy={yTLRest + AVATAR_RADIUS} 
                        r={AVATAR_RADIUS} 
                    />
                </clipPath>
            </defs>
            
            {/* 2. The <g> element applies the chaotic bouncing/attraction transform and the main bucket clip */}
            <g 
                className={className} 
                style={style}
                clipPath="url(#bucketClip)"
            >
                {/* 3. The <image> element renders the profile picture */}
                <image
                    href={contributor.avatar_url}
                    x={xTLRest}
                    y={yTLRest}
                    height={AVATAR_SIZE}
                    width={AVATAR_SIZE}
                    clipPath={`url(#avatarClip-${contributor.id})`}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.setAttribute('href', `https://placehold.co/${AVATAR_SIZE}x${AVATAR_SIZE}/1e293b/FFFFFF?text=${contributor.login.substring(0, 1)}`);
                    }}
                />
            </g>
            
            {/* 4. Floating Name Tag (Renders outside the <g> for clean separation) */}
            {isHovered && (
                <text
                    x={textX}
                    y={textY}
                    fill={isHovered ? strokeColor : '#fff'}
                    fontSize="10"
                    textAnchor="middle"
                    className="neon-text-float"
                    style={{
                        animation: 'textFloatUp 0.6s forwards',
                        // Ensure the text scales/moves correctly with the main avatar's transform
                        transform: style.transform,
                        transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    }}
                >
                    @{contributor.login}
                </text>
            )}
        </a>
    );
};


/**
 * Main App Component: Interactive Container with Bouncing Avatars.
 */
const App: FC = () => {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState<MousePos>({ x: SVG_WIDTH / 2, y: SVG_HEIGHT / 2 }); 

    // Fetching logic: Fetches real contributor data from GitHub
    useEffect(() => {
        const fetchContributors = async () => {
            try {
                const response = await fetch(GITHUB_API_URL);
                if (!response.ok) {
                    // Placeholder data for testing without GitHub API access
                    setContributors([
                        { id: 100, login: 'User_A', avatar_url: 'https://placehold.co/30x30/1e293b/fff?text=A', html_url: '#' },
                        { id: 101, login: 'User_B', avatar_url: 'https://placehold.co/30x30/1e293b/fff?text=B', html_url: '#' },
                        { id: 102, login: 'User_C', avatar_url: 'https://placehold.co/30x30/1e293b/fff?text=C', html_url: '#' },
                        { id: 103, login: 'User_D', avatar_url: 'https://placehold.co/30x30/1e293b/fff?text=D', html_url: '#' },
                        { id: 104, login: 'User_E', avatar_url: 'https://placehold.co/30x30/1e293b/fff?text=E', html_url: '#' },
                    ]);
                    throw new Error(`GitHub API error: ${response.statusText}. Using placeholder data.`);
                }
                const data = await response.json();
                setContributors(data.slice(0, MAX_CONTRIBUTORS)); 
            } catch (error) {
                console.error("Failed to fetch contributors:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContributors();
    }, []);

    const totalContributors = contributors.length;
    
    // Dynamic Bucket Dimensions on Hover
    const W_FINAL = isHovered ? BUCKET_W_BASE * 1.1 : BUCKET_W_BASE;
    const H_FINAL = isHovered ? BUCKET_H_BASE * 1.1 : BUCKET_H_BASE;
    const X_FINAL = (SVG_WIDTH - W_FINAL) / 2;
    const Y_FINAL = FLOOR_Y - H_FINAL;
    
    // Calculate clip height to end precisely at FLOOR_Y.
    const CLIP_HEIGHT = FLOOR_Y - (Y_FINAL + 1);

    // Dynamic Neon Color
    const STROKE_COLOR = isHovered ? '#f472b6' : '#67e8f9'; // Magenta on hover

    // Mouse Move Handler (tracks position relative to the SVG container)
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svgRect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - svgRect.left,
            y: e.clientY - svgRect.top,
        });
    };
    
    // 3D Tilt Transform Style
    const svgWrapperStyle: React.CSSProperties = {
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s ease-out',
        transform: isHovered ? 'perspective(800px) rotateX(5deg)' : 'perspective(800px) rotateX(0deg)',
    };


    return (
        <div className="w-full h-screen flex items-center justify-center bg-transparent text-white font-sans">
            {isLoading ? (
                <div className="text-neon-cyan flex items-center justify-center text-xl text-cyan-400">
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Fetching Avatars...
                </div>
            ) : (
                // SVG container handles centering and hover events
                <div 
                    className="w-full max-w-xl mx-auto h-[90vh] flex items-center justify-center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="w-full h-full max-h-[400px] max-w-[400px] flex items-center justify-center" style={svgWrapperStyle}>
                        <svg 
                            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} 
                            className="w-full h-full"
                            onMouseMove={handleMouseMove} // Track mouse movement inside the SVG
                        >
                            {/* --- SVG DEFINITIONS (MAIN BUCKET CLIP) --- */}
                            <defs>
                                <clipPath id="bucketClip">
                                    <rect
                                        x={X_FINAL + 1} 
                                        y={Y_FINAL + 1}
                                        width={W_FINAL - 2}
                                        // Use the dynamically calculated CLIP_HEIGHT to avoid floor cutting
                                        height={CLIP_HEIGHT} 
                                        rx="9"
                                        className="clip-transition"
                                    />
                                </clipPath>
                            </defs>
                            
                            {/* -------------------- THE NEON BUCKET OUTLINE -------------------- */}
                            <rect
                                x={X_FINAL}
                                y={Y_FINAL}
                                width={W_FINAL}
                                height={H_FINAL}
                                fill="none"
                                stroke={STROKE_COLOR}
                                strokeWidth="3"
                                rx="10" 
                                className="neon-bucket-transition"
                            />
                            {/* ----------------------------------------------------------------- */}

                            {contributors.map((c, index) => (
                                <ContributorBall 
                                    key={c.id} 
                                    contributor={c} 
                                    index={index}
                                    total={totalContributors}
                                    isHovered={isHovered}
                                    mousePos={mousePos}
                                    // Pass dynamic bucket dimensions for grid calculation
                                    W_FINAL={W_FINAL}
                                    X_FINAL={X_FINAL}
                                    Y_FINAL={Y_FINAL}
                                    strokeColor={STROKE_COLOR}
                                />
                            ))}
                        </svg>
                    </div>
                </div>
            )}

            {/* Custom CSS for Neon Glow, Transitions, and Bouncing Animations */}
            <style>{`
                /* 1. CHAOTIC BOUNCE KEYFRAMES (Vertical, Horizontal, and Rotation) */
                @keyframes chaoticBounce {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg) scale(1); 
                        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Ease-out */
                    }
                    50% {
                        transform: translateY(var(--max-jump)) translateX(var(--h-shift)) rotate(var(--rotation)) scale(1); 
                        animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53); /* Ease-in */
                    }
                    100% {
                        transform: translateY(0) translateX(0) rotate(0deg) scale(1); 
                        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    }
                }
                .chaoticBounce-animation {
                    animation-name: chaoticBounce;
                    animation-iteration-count: infinite; 
                    animation-direction: alternate;
                }
                
                /* Keyframes for floating text when arranged in grid */
                @keyframes textFloatUp {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* 2. NEON GLOW STYLES AND TRANSITIONS */
                .contributor-avatar {
                    transform-origin: center; 
                    /* Ensures the image itself is visible */
                    filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.5)); 
                }
                
                .neon-text-float {
                    font-weight: 600;
                    text-shadow: 0 0 2px currentColor, 0 0 5px currentColor;
                    opacity: 0; /* Managed by keyframe */
                }

                .text-neon-cyan {
                    color: #67e8f9; 
                    text-shadow: 0 0 4px #67e8f9, 0 0 10px #67e8f9, 0 0 16px rgba(103, 232, 249, 0.5); 
                }

                /* SVG Rect transition for smooth resizing and recoloring */
                .neon-bucket-transition {
                    transition: all 0.5s ease-in-out; 
                    filter: drop-shadow(0 0 5px var(--neon-color, #67e8f9)) drop-shadow(0 0 10px var(--neon-color, #67e8f9));
                }
                
                .neon-bucket-transition[stroke="#f472b6"] {
                    filter: drop-shadow(0 0 5px #f472b6) drop-shadow(0 0 10px #f472b6) drop-shadow(0 0 15px rgba(244, 114, 182, 0.5));
                }

                #bucketClip rect {
                    transition: all 0.5s ease-in-out;
                }
             `}</style>
        </div>
    );
};

export default App;
