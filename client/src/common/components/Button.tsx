import classNames from "classnames";
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type ButtonProps = {
    variant?: "primary" | "secondary" | "tertiary" | "danger";
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ variant = "primary", children, className, ...rest }: ButtonProps) => {
    const variantStyles = {
        "primary": "bg-gradient-to-r from-purple-500 to-pink-500 rounded-md",
        "secondary": "bg-purple-500 text-white rounded-md",
        "tertiary": "border border-[#eb614b] rounded hover:",
        "danger": "rounded-md bg-red-500 text-white hover:bg-red-600 transition"
    }
    return (
        <button className={twMerge(classNames("px-2 py-1 cursor-pointer", className, variantStyles[variant]))} {...rest}>{children}</button>
    )
}

export default Button