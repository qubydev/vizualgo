import { cn } from "@/lib/utils"


export const Mark = ({ children, className }) => {

    return (
        <span className={cn(
            "mark",
            className
        )}>
            {children}
        </span>
    )
}