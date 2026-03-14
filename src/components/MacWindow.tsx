import React from 'react';
import { VideoTheme, THEME_CONFIG } from '../remotion/themes';

interface MacWindowProps {
    children: React.ReactNode;
    theme: VideoTheme;
}

export const MacWindow: React.FC<MacWindowProps> = ({ children, theme }) => {
    const config = THEME_CONFIG[theme];
    const isTerminal = config.isTerminal;

    return (
        <div 
            className="flex flex-col h-full overflow-hidden shadow-2xl rounded-xl border border-white/10"
            style={{ 
                background: config.containerBg,
                fontFamily: config.font 
            }}
        >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b border-white/5 ${isTerminal ? 'bg-black' : 'bg-white/5'}`}>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                {isTerminal && (
                    <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                        Terminal — iTerm2
                    </div>
                )}
                <div className="w-12" /> {/* Placeholder for balance */}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {children}
            </div>
        </div>
    );
};
