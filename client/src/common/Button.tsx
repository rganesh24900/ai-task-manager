import classNames from "classnames";
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type ButtonProps = {
    variant?: "primary" | "secondary" | "tertiary";
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ variant = "primary", children, ...rest }: ButtonProps) => {
    const variantStyles = {
        "primary": "bg-[#eb614b] text-white rounded",
        "secondary": "bg-blue-500 text-white rounded",
        "tertiary": "border border-[#eb614b] rounded hover:"
    }
    return (
        <button className={twMerge(classNames("w-[104px] h-8", variantStyles[variant]))} {...rest}>{children}</button>
    )
}

export default Button