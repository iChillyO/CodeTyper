import React from 'react';
import { AbsoluteFill } from 'remotion';
import { z } from 'zod';
import { MacWindow } from '../components/MacWindow';
import { CodeTyper } from '../components/CodeTyper';

export const myCompSchema = z.object({
    codeString: z.string(),
    language: z.string(),
});

export const MyComposition: React.FC<z.infer<typeof myCompSchema>> = ({ codeString, language }) => {
    return (
        <AbsoluteFill className="bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center p-20">
            <MacWindow>
                <CodeTyper
                    codeString={codeString}
                    language={language}
                />
            </MacWindow>
        </AbsoluteFill>
    );
};
