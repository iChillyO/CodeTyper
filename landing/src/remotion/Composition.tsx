import React, { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { MacWindow } from '../components/MacWindow';
import { CodeTyper } from '../components/CodeTyper';
import { VideoTheme, THEME_CONFIG } from './themes';

interface MyCompositionProps {
    codeString: string;
    language: string;
    baseDelayMs: number;
    theme: VideoTheme;
    cursorStyle?: "block" | "bar" | "line";
}

export const MyComposition: React.FC<MyCompositionProps> = ({
    codeString,
    language,
    baseDelayMs,
    theme,
    cursorStyle = "block"
}) => {
    const { width: videoWidth } = useVideoConfig();
    const config = THEME_CONFIG[theme];

    // Take whole screen for YouTube
    const isWidescreen = videoWidth > 1200;
    
    return (
        <AbsoluteFill
            style={{
                background: config.containerBg,
                display: 'flex',
                alignItems: isWidescreen ? 'stretch' : 'center',
                justifyContent: 'center',
                padding: isWidescreen ? 0 : '4%'
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: isWidescreen ? '100%' : '90%',
                    height: isWidescreen ? '100%' : 'auto',
                    minHeight: isWidescreen ? '100%' : '60%', // Ensure it doesn't collapse
                    aspectRatio: isWidescreen ? 'unset' : '9 / 16', // Optional: keep a nice ratio
                    filter: !isWidescreen && theme !== 'terminal' ? `drop-shadow(0 20px 60px rgba(0,0,0,0.4))` : 'none',
                    display: 'flex', // Ensure MacWindow can fill it
                    flexDirection: 'column'
                }}
            >
                <MacWindow theme={theme}>
                    <CodeTyper
                        codeString={codeString}
                        language={language}
                        baseDelayMs={baseDelayMs}
                        theme={theme}
                        cursorStyle={cursorStyle}
                    />
                </MacWindow>
            </div>
        </AbsoluteFill>
    );
};
