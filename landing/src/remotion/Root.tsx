import React from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';
import { calculateDuration } from '../lib/video-utils';
import '../app/globals.css';

// Default props that match the composition interface
const defaultProps = {
    codeString: `const welcome = () => {\n  console.log("Welcome to CodeTyper!");\n  console.log("Turn your code into cinematic videos in seconds.");\n  return "🚀 Ready to go!";\n};`,
    language: 'javascript',
    baseDelayMs: 45,
    theme: 'original' as const,
    cursorStyle: 'block' as const
};

export const RemotionRoot: React.FC = () => {
    return (
        <Composition
            id="CodeTyper"
            component={MyComposition as React.FC<any>}
            durationInFrames={calculateDuration(defaultProps.codeString, defaultProps.baseDelayMs)}
            fps={30}
            width={1080}
            height={1920}
            calculateMetadata={({ props }) => {
                return {
                    width: (props as any).width || 1080,
                    height: (props as any).height || 1920,
                };
            }}
            defaultProps={{
                ...defaultProps,
                width: 1080,
                height: 1920
            }}
        />
    );
};
