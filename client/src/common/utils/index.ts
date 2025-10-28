import classNames from "classnames"
import { twMerge } from "tailwind-merge"

export const cn = (...classes:any)=>{
    return twMerge(classNames(classes))
}