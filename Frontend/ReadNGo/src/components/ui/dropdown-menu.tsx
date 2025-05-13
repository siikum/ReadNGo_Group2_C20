import * as React from "react"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

const DropdownMenuContext = React.createContext<{
    open: boolean
    setOpen: (open: boolean) => void
}>({
    open: false,
    setOpen: () => { },
})

const DropdownMenu = ({ open = false, onOpenChange, children }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = React.useState(open)

    React.useEffect(() => {
        setIsOpen(open)
    }, [open])

    const handleOpenChange = (newOpen: boolean) => {
        setIsOpen(newOpen)
        onOpenChange?.(newOpen)
    }

    return (
        <DropdownMenuContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>
            <div className="relative">
                {children}
            </div>
        </DropdownMenuContext.Provider>
    )
}

const DropdownMenuTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(DropdownMenuContext)

    return (
        <button
            ref={ref}
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className={cn("outline-none", className)}
            {...props}
        >
            {children}
        </button>
    )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { open } = React.useContext(DropdownMenuContext)

    if (!open) return null

    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 mt-2",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
            inset && "pl-8",
            className
        )}
        role="menuitem"
        {...props}
    />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuCheckboxItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { checked?: boolean }
>(({ className, children, checked, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
            className
        )}
        role="menuitemcheckbox"
        aria-checked={checked}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {checked && <Check className="h-4 w-4" />}
        </span>
        {children}
    </div>
))
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

const DropdownMenuRadioItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { checked?: boolean }
>(({ className, children, checked, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
            className
        )}
        role="menuitemradio"
        aria-checked={checked}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {checked && <Circle className="h-2 w-2 fill-current" />}
        </span>
        {children}
    </div>
))
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

const DropdownMenuLabel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "px-2 py-1.5 text-sm font-semibold",
            inset && "pl-8",
            className
        )}
        {...props}
    />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        role="separator"
        {...props}
    />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
            {...props}
        />
    )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

const DropdownMenuGroup = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div role="group" {...props}>{children}</div>
)

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
}