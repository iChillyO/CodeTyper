import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    leftIcon?: React.ReactNode
    rightElement?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, leftIcon, rightElement, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium text-white/70 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "flex w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                            leftIcon && "pl-10",
                            rightElement && "pr-10",
                            error && "border-red-500/50 focus:ring-red-500/40 focus:border-red-500/40",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {rightElement}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-red-400 font-medium mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"
