export const calculateAppearanceTimes = (codeString: string, baseDelayMs: number) => {
    const times = [0]; // First character appears at 0ms
    let currentTime = 0;
    const specialChars = [';', '{', '}', '(', ')'];

    for (let i = 0; i < codeString.length; i++) {
        const char = codeString[i];
        let pause = 0;
        if (char === '\n') pause = 200;
        else if (specialChars.includes(char)) pause = 100;

        currentTime += baseDelayMs + pause;
        times.push(currentTime);
    }
    return times;
};

export const calculateDuration = (rawCodeStr: string, currentSpeedMs: number) => {
    const codeStr = rawCodeStr.trimStart();
    const baseDelayMs = currentSpeedMs;
    const newlineCount = (codeStr.match(/\n/g) || []).length;
    const specialChars = [';', '{', '}', '(', ')'];
    let specialCharCount = 0;
    for (const char of codeStr) {
        if (specialChars.includes(char)) specialCharCount++;
    }

    const baseTypingTimeMs = codeStr.length * baseDelayMs;
    const extraPauseTimeMs = (newlineCount * 200) + (specialCharCount * 100);
    const totalTimeMs = baseTypingTimeMs + extraPauseTimeMs + 2500; // Ending hold

    const fps = 30;
    const totalFrames = Math.ceil((totalTimeMs / 1000) * fps);
    return Math.max(totalFrames, fps * 2);
};
