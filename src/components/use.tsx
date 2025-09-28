import React, { FC, useState, useMemo, useCallback, ChangeEvent, SyntheticEvent } from 'react';

// --- Stylized Text Constants using Unicode Double-Struck Font ---
const STYLIZED_USERNAME_LABEL = '𝔾𝕚𝕥ℍ𝕦𝕓 𝕌𝕤𝕖𝕣𝕟𝕒𝕞𝕖';
const STYLIZED_THEME_LABEL = '𝔽𝕣𝕒𝕞𝕖 𝕋𝕙𝕖𝕞𝕖';
const STYLIZED_SIZE_LABEL = '𝕊𝕚𝕫𝕖 (𝕡𝕩)';
const STYLIZED_SNIPPET_HEADING = '𝔻𝕪𝕟𝕒𝕞𝕚𝕔 ℂ𝕠𝕕𝕖 𝕊𝕟𝕚𝕡𝕡𝕖𝕥';
const STYLIZED_PREVIEW_HEADING = '𝕃𝕚𝕧𝕖 𝕆𝕦𝕥𝕡𝕦𝕥 ℙ𝕣𝕖𝕧𝕚𝕖𝕨';

// ... (Interface definitions for InputElementTarget and SelectElementTarget remain the same) ...

/**
 * A responsive component for previewing the GitHub Avatar Frame API usage. (Renamed to Ui for context)
 */
const Ui: FC = () => { // RENAMED: CodeEditorView -> Ui
    // --- State Management ---
    const [username, setUsername] = useState('octocat');
    const [theme, setTheme] = useState('neon');
    const [size, setSize] = useState('256');
    
    // Base URL for the API
    const baseUrl = 'https://github-avatar-frame-api.vercel.app';

    // --- Derived Values (Memoized/Computed) ---
    const { snippetUrl, liveImageUrl, parsedSizeNum } = useMemo(() => {
        const currentSize = size || '256';
        // The URL is dynamically calculated based on the inputs
        const sUrl = `/api/framed-avatar/${username}?theme=${theme}&size=${currentSize}`;
        const lImageUrl = `${baseUrl}${sUrl}`;
        const pSizeNum = parseInt(currentSize) || 256; 
        
        return { snippetUrl: sUrl, liveImageUrl: lImageUrl, parsedSizeNum: pSizeNum };
    }, [username, theme, size]); // DEPENDS ON: username, theme, size


    // --- Event Handlers ---
    const updateUsername = useCallback((e: ChangeEvent<HTMLInputElement>) => { // Adjusted type for simplicity
        setUsername(e.target.value); 
    }, []);
    
    const updateTheme = useCallback((e: ChangeEvent<HTMLSelectElement>) => { // Adjusted type for simplicity
        setTheme(e.target.value); 
    }, []);
    
    const updateSize = useCallback((e: ChangeEvent<HTMLInputElement>) => { // Adjusted type for simplicity
        const value = e.target.value;
        setSize(value && parseInt(value) > 32 ? value : '256'); 
    }, []);

    const onImageError = useCallback((e: SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        target.onerror = null; 
        target.src = `https://placehold.co/${parsedSizeNum}x${parsedSizeNum}/1f2937/ffffff?text=Load+Error`;
    }, [parsedSizeNum]);
    
    // JSX structure for the multi-line code snippet
    const codeSnippetJSX = useMemo(() => (
        <code className="language-html leading-relaxed text-left">
            <span className="text-yellow-500">&lt;div</span> <span className="text-blue-400">align</span><span className="text-white">=</span><span className="text-green-500">"center"</span><span className="text-yellow-500">&gt;</span><br/>
            &nbsp;&nbsp;<span className="text-yellow-500">&lt;a</span> <span className="text-blue-400">href</span><span className="text-white">=</span><span className="text-green-500">"{baseUrl}"</span><span className="text-yellow-500">&gt;</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-500">&lt;img</span> <span className="text-blue-400">src</span><span className="text-white">=</span><span className="text-green-500">"{snippetUrl}"</span> <span className="text-blue-400">alt</span><span className="text-white">=</span><span className="text-green-500">"Framed Avatar"</span> <span className="text-blue-400">width</span><span className="text-white">=</span><span className="text-green-500">"{size}"</span><span className="text-yellow-500">&gt;</span><br/>
            &nbsp;&nbsp;<span className="text-yellow-500">&lt;/a&gt;</span><br/>
            <span className="text-yellow-500">&lt;/div&gt;</span>
        </code>
    ), [snippetUrl, size]);


    return (
        <div className="w-full flex flex-col items-center p-2 sm:p-4 font-[Inter] bg-transparent">

            {/* Input Controls Container */}
            <div className="w-full max-w-4xl mb-6 sm:mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl border border-blue-600/50">
                
                {/* Username Input */}
                <div className="flex flex-col">
                    <label htmlFor="username" className="text-blue-400 text-sm font-extrabold block mb-1 tracking-wider">
                        {STYLIZED_USERNAME_LABEL}
                    </label>
                    <input 
                        id="username"
                        value={username}
                        onChange={updateUsername}
                        placeholder="e.g., octocat"
                        className="w-full p-2 bg-gray-900/70 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200 hover:border-teal-400/50"
                        type="text"
                    />
                </div>

                {/* Theme Input (Dropdown) */}
                <div className="flex flex-col">
                    <label htmlFor="theme" className="text-blue-400 text-sm font-extrabold block mb-1 tracking-wider">
                        {STYLIZED_THEME_LABEL}
                    </label>
                    <select 
                        id="theme"
                        value={theme}
                        onChange={updateTheme}
                        className="w-full p-2 bg-gray-900/70 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200 hover:border-teal-400/50 appearance-none cursor-pointer"
                    >
                        <option value="neon">✨ Neon (Default)</option>
                        <option value="classic">⚫ Classic</option>
                        <option value="gold">🏆 Gold</option>
                        <option value="space">🌌 Space</option>
                    </select>
                </div>

                {/* Size Input */}
                <div className="flex flex-col">
                    <label htmlFor="size" className="text-blue-400 text-sm font-extrabold block mb-1 tracking-wider">
                        {STYLIZED_SIZE_LABEL}
                    </label>
                    <input 
                        id="size"
                        value={size}
                        onChange={updateSize}
                        placeholder="e.g., 256"
                        className="w-full p-2 bg-gray-900/70 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200 hover:border-teal-400/50"
                        type="number"
                    />
                </div>
            </div>

            {/* Code Editor and Live Output Container */}
            <div className="w-full max-w-4xl">
                <div className="w-full bg-[#1e1e1e] rounded-xl overflow-hidden transition-all duration-500 transform 
                    shadow-2xl animate-color-glow border border-gray-700/50">
                    
                    {/* Editor Header / Traffic Lights */}
                    <div className="flex items-center p-3 border-b border-[#2d2d2d] bg-[#252526] rounded-t-xl">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full" title="Close"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" title="Minimize"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full" title="Maximize"></div>
                        </div>
                        <div className="flex-grow text-center text-gray-400 text-sm font-mono tracking-wider">
                            README.md
                        </div>
                    </div>

                    {/* Code and Output Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        
                        {/* LEFT: Code Editor View */}
                        <div className="p-4 sm:p-6 overflow-x-auto text-sm font-mono select-text border-b lg:border-b-0 lg:border-r border-[#2d2d2d]">
                            <h3 className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 font-extrabold mb-3">
                                {STYLIZED_SNIPPET_HEADING}
                            </h3>
                            <pre className="p-4 bg-black/40 rounded-lg whitespace-pre-wrap break-words">
                                {codeSnippetJSX}
                            </pre>
                            <p className="text-xs text-gray-500 mt-2 italic">The `src` and `width` values update automatically.</p>
                        </div>

                        {/* RIGHT: Live Output Display */}
                        <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-[#181818] min-h-[300px]">
                            <h3 className="text-white font-extrabold mb-6 text-lg tracking-wider">
                                {STYLIZED_PREVIEW_HEADING}
                            </h3>
                            <div className="w-full flex items-center justify-center">
                                <a href={liveImageUrl} target="_blank" rel="noopener noreferrer" 
                                   className="transition hover:scale-[1.03] duration-300 transform ring-2 ring-transparent hover:ring-blue-500/50 rounded-full">
                                    {/* Live Image */}
                                    <img 
                                        src={liveImageUrl} 
                                        alt={`Framed avatar for ${username} with ${theme} theme`} 
                                        width={parsedSizeNum}
                                        height={parsedSizeNum}
                                        className={`object-cover rounded-full shadow-xl transition-all duration-300`}
                                        onError={onImageError}
                                    />
                                </a>
                            </div>
                            <p className="text-xs text-gray-500 mt-6 text-center">
                                Current URL: <code className="text-teal-400 text-[10px] sm:text-xs break-all">{snippetUrl}</code>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Injected CSS (UNCHANGED) */}
            <style>{`
                /* Syntax Highlighting Colors (VS Code Dark Theme inspired) */
                .language-html .text-yellow-500 { color: #FFD700; } /* Tags */
                .language-html .text-blue-400 { color: #9CDCFE; } /* Attributes */
                .language-html .text-green-500 { color: #CE9178; } /* String Values */
                .language-html .text-white { color: #D4D4D4; } /* Equal Sign */

                /* Custom Color Glow Animation for the border/shadow */
                @keyframes colorGlow {
                    0% {
                        box-shadow: 0 0 15px rgba(59, 130, 246, 0.7), 0 0 50px rgba(59, 130, 246, 0.4); /* Blue */
                    }
                    25% {
                        box-shadow: 0 0 15px rgba(139, 92, 246, 0.7), 0 0 50px rgba(139, 92, 246, 0.4); /* Purple */
                    }
                    50% {
                        box-shadow: 0 0 15px rgba(236, 72, 153, 0.7), 0 0 50px rgba(236, 72, 153, 0.4); /* Pink */
                    }
                    75% {
                        box-shadow: 0 0 15px rgba(20, 184, 166, 0.7), 0 0 50px rgba(20, 184, 166, 0.4); /* Teal */
                    }
                    100% {
                        box-shadow: 0 0 15px rgba(59, 130, 246, 0.7), 0 0 50px rgba(59, 130, 246, 0.4); /* Back to Blue */
                    }
                }
                .animate-color-glow {
                    animation: colorGlow 15s infinite alternate ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Ui;