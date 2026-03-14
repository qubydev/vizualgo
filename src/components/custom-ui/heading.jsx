import { cn } from "@/lib/utils"


export const Heading = ({ level = 1, children, className }) => {

    if (level == 1) {
        return (
            <h1 className={cn(
                "font-bold text-2xl",
                className
            )}>
                <span className="border-b-2 border-dashed border-primary inline">{children}</span>
            </h1>
        )
    } else if (level == 2) {
        return (
            <h2 className={cn(
                "font-bold text-xl",
                className
            )}>
                <span className="inline">{children}</span>
            </h2>
        )
    }

    return (
        <p className={className}>
            <span>{children}</span>
        </p>
    )
}