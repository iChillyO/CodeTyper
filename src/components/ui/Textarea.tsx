import React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
    return (
        <textarea
            className={cn(
                "flex min-h-[120px] w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-electric-blue/50 disabled:cursor-not-allowed disabled:opacity-50 font-mono",
                className
            )}
            {...props}
        />
    );
}
