export async function generateTitle(code: string, language: string = 'javascript'): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("GEMINI_API_KEY not found in environment variables. Falling back to default title.");
        return "Untitled render";
    }

    try {
        // Truncate code to prevent excessive token usage (approx. max 4000 chars)
        const maxChars = 4000;
        const truncatedCode = code.length > maxChars ? code.substring(0, maxChars) + "..." : code;

        // Try primary model, fallback to standard flash
        const modelsToTry = [
            "gemini-3.1-flash-lite-preview",
            "gemini-2.5-flash",
            "gemini-1.5-flash"
        ];

        for (const model of modelsToTry) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        systemInstruction: {
                            parts: [
                                { text: "You are a code assistant that generates extremely short, concise titles for code snippets. Output exactly 4 to 10 words. Do not use emojis. Do not use surrounding quotes. Do not use trailing punctuation. Return the result strictly in JSON." }
                            ]
                        },
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    { text: `Language: ${language}\n\nCode:\n${truncatedCode}` }
                                ]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.3,
                            responseMimeType: "application/json",
                            responseSchema: {
                                type: "OBJECT",
                                properties: {
                                    title: { type: "STRING" }
                                },
                                required: ["title"]
                            }
                        }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates && data.candidates.length > 0) {
                        const content = data.candidates[0].content.parts[0].text;
                        const parsed = JSON.parse(content);
                        if (parsed.title && typeof parsed.title === 'string') {
                            let title = parsed.title.trim();
                            // Strip quotes just in case
                            title = title.replace(/^["']|["']$/g, '');
                            return title;
                        }
                    }
                }

                // If model failed (e.g. 404 not found for 3.1-flash-lite yet), continue to the next model in the list
                if (response.status !== 404 && response.status !== 400) {
                    console.warn(`Gemini API returned status ${response.status} for model ${model}`);
                }
            } catch (err) {
                console.warn(`Error connecting to model ${model}:`, err);
            }
        }

        return "Untitled render";

    } catch (error) {
        console.error("Gemini Title Generation Error:", error);
        return "Untitled render";
    }
}
