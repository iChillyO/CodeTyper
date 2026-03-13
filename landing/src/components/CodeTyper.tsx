import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Highlight, themes as prismThemes } from 'prism-react-renderer';
import { VideoTheme, THEME_CONFIG } from '../remotion/themes';
import { calculateAppearanceTimes } from '../lib/video-utils';

interface CodeTyperProps {
    codeString: string;
    language: string;
    baseDelayMs: number;
    theme: VideoTheme;
    cursorStyle?: "block" | "bar" | "line";
}

export const CodeTyper: React.FC<CodeTyperProps> = ({ 
    codeString, 
    language, 
    baseDelayMs, 
    theme,
    cursorStyle = "block"
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const config = THEME_CONFIG[theme];

    // Calculate how many characters to show based on appearance times
    const appearanceTimes = useMemo(() => calculateAppearanceTimes(codeString, baseDelayMs), [codeString, baseDelayMs]);
    const currentTimeMs = (frame * 1000) / fps;
    
    const charsToShow = useMemo(() => {
        let count = 0;
        for (let i = 0; i < appearanceTimes.length; i++) {
            if (appearanceTimes[i] <= currentTimeMs) {
                count = i;
            } else {
                break;
            }
        }
        return count;
    }, [appearanceTimes, currentTimeMs]);
    const currentCode = codeString.slice(0, Math.max(0, charsToShow));
    const lines = currentCode.split('\n');
    const totalLines = codeString.split('\n').length;
    const currentLineIndex = lines.length - 1;

    // Auto-scroll logic: if we have many lines, shift the view up
    const maxVisibleLines = 15;
    const translateY = currentLineIndex > maxVisibleLines 
        ? (currentLineIndex - maxVisibleLines) * -1.6 * 1.2 : 0; // -1.6 (line-height) * 1.2 (rem)

    // Blinking cursor logic
    const showCursor = Math.floor(frame / 10) % 2 === 0;

    // Mapping custom themes to prism themes if possible
    // For now using vsDark as default for all
    const prismTheme = theme === 'terminal' ? prismThemes.vsDark : prismThemes.vsDark;

    const renderCursor = () => {
        if (!showCursor && charsToShow < codeString.length) return null;
        
        const cursorStyles = {
            block: "w-2 h-5 bg-current translate-y-1",
            bar: "w-[2px] h-5 bg-current translate-y-1",
            line: "w-full h-[2px] bg-current absolute bottom-0 left-0"
        };

        return (
            <span 
                className={`inline-block ml-0.5 ${cursorStyles[cursorStyle]} transition-opacity`}
                style={{ 
                    color: config.cursor,
                    backgroundColor: cursorStyle !== 'line' ? config.cursor : 'transparent',
                    boxShadow: `0 0 8px ${config.cursor}40`
                }}
            />
        );
    };

    return (
        <div 
            className="w-full h-full p-6 sm:p-8 overflow-hidden flex flex-col"
            style={{ 
                color: config.textColor,
                fontSize: '1.2rem',
                lineHeight: '1.6',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
            }}
        >
            <Highlight
                theme={prismTheme}
                code={currentCode}
                language={language as any}
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <div 
                        style={{ 
                            transform: `translateY(${translateY}rem)`,
                            transition: 'transform 0.3s ease-out'
                        }}
                    >
                        <pre 
                            className={className} 
                            style={{ 
                                ...style, 
                                background: 'transparent',
                                whiteSpace: 'pre-wrap', // Allow wrapping for long lines
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                margin: 0,
                                padding: 0,
                                display: 'block',
                                width: '100%'
                            }}
                        >
                            {tokens.map((line, i) => (
                                <div 
                                    key={i} 
                                    {...getLineProps({ 
                                        line, 
                                        className: "block min-h-[1.6em] relative" 
                                    })}
                                >
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                    {i === tokens.length - 1 && renderCursor()}
                                </div>
                            ))}
                        </pre>
                    </div>
                )}
            </Highlight>
        </div>
    );
};
