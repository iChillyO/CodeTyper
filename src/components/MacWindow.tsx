import React from 'react';

interface MacWindowProps {
    children: React.ReactNode;
}

export const MacWindow: React.FC<MacWindowProps> = ({ children }) => {
    return (
        <div className="w-full max-w-4xl rounded-xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden">
            {/* MacOS Title Bar */}
            <div className="h-10 bg-slate-800/50 flex items-center px-4 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10" />
                </div>
            </div>
            {/* Content Area */}
            <div className="bg-slate-950">
                {children}
            </div>
        </div>
    );
};
