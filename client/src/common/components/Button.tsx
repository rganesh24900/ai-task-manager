import classNames from "classnames";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
    variant?: "primary" | "secondary" | "tertiary" | "danger";
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ variant = "primary", children, className, ...rest }: ButtonProps) => {
    const variantStyles = {
        primary:
            "bg-gray-900 text-white rounded-lg hover:bg-black transition shadow-sm",

        secondary:
            "bg-[#fafafa] text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-100 transition",

        tertiary:
            "border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition",

        danger:
            "bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-sm",
    };

    return (
        <button
            className={twMerge(
                classNames(
                    "px-4 py-2 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                    variantStyles[variant],
                    className
                )
            )}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
