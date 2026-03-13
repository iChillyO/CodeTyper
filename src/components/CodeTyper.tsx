import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeTyperProps {
    codeString: string;
    language?: string;
}

export const CodeTyper: React.FC<CodeTyperProps> = ({ codeString, language = 'javascript' }) => {
    const frame = useCurrentFrame();

    // LOGIC: Show 3 characters per frame
    const charsToShow = Math.floor(frame * 3);
    const currentCode = codeString.slice(0, charsToShow);

    // LOGIC: Blinking cursor every 15 frames
    const showCursor = Math.floor(frame / 15) % 2 === 0;

    return (
        <div className="w-full h-full bg-slate-950 p-6 font-mono text-lg rounded-b-xl overflow-hidden shadow-2xl relative border border-white/10">
            <Highlight
                theme={themes.vsDark}
                code={currentCode}
                language={language as any}
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={className} style={{ ...style, background: 'transparent' }}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                        {/* The Blinking Cursor */}
                        {charsToShow < codeString.length + 1 && (
                            <span className="inline-block w-2.5 h-6 bg-blue-500 ml-1 translate-y-1"
                                style={{ opacity: showCursor ? 1 : 0 }} />
                        )}
                    </pre>
                )}
            </Highlight>
        </div>
    );
};
