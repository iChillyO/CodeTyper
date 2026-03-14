export type VideoTheme = "original" | "dark" | "vscode" | "terminal" | "midnight";

export interface ThemeConfig {
    background: string;
    containerBg: string;
    textColor: string;
    accent: string;
    cursor: string;
    font: string;
    isTerminal?: boolean;
}

export const THEME_CONFIG: Record<VideoTheme, ThemeConfig> = {
    original: {
        background: "linear-gradient(to bottom, #18181b, #000000)",
        containerBg: "#020617",
        textColor: "#e2e8f0",
        accent: "#3b82f6",
        cursor: "#3b82f6",
        font: "ui-monospace, 'Geist Mono', 'SF Mono', Monaco, Consolas, monospace"
    },
    dark: {
        background: "#0B0F1A",
        containerBg: "#111827",
        textColor: "#E5E7EB",
        accent: "#3B82F6",
        cursor: "#3B82F6",
        font: "'Inter', sans-serif"
    },
    vscode: {
        background: "#1E1E1E",
        containerBg: "#252526",
        textColor: "#D4D4D4",
        accent: "#007ACC",
        cursor: "#007ACC",
        font: "'Consolas', monospace"
    },
    terminal: {
        background: "#000000",
        containerBg: "#0A0A0A",
        textColor: "#33FF33",
        accent: "#33FF33",
        cursor: "#33FF33",
        font: "'Courier New', monospace",
        isTerminal: true
    },
    midnight: {
        background: "linear-gradient(135deg, #0F172A, #1E293B)",
        containerBg: "#111827",
        textColor: "#F8FAFC",
        accent: "#6366F1",
        cursor: "#6366F1",
        font: "'Inter', sans-serif"
    }
};
