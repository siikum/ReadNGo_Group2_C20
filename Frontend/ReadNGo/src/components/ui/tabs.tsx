import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
    value: string
    onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue>({
    value: "",
    onValueChange: () => { },
})

interface TabsProps {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    className?: string
    children: React.ReactNode
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ defaultValue = "", value: controlledValue, onValueChange, className, children }, ref) => {
        const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
        const value = controlledValue ?? uncontrolledValue

        const handleValueChange = React.useCallback((newValue: string) => {
            if (controlledValue === undefined) {
                setUncontrolledValue(newValue)
            }
            onValueChange?.(newValue)
        }, [controlledValue, onValueChange])

        return (
            <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
                <div ref={ref} className={cn("flex flex-col gap-2", className)}>
                    {children}
                </div>
            </TabsContext.Provider>
        )
    }
)
Tabs.displayName = "Tabs"

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
    children: React.ReactNode
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            role="tablist"
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string
    className?: string
    children: React.ReactNode
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ value, className, children, ...props }, ref) => {
        const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
        const isActive = value === selectedValue

        return (
            <button
                ref={ref}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${value}`}
                onClick={() => onValueChange(value)}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isActive && "bg-background text-foreground shadow-sm",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        )
    }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
    className?: string
    children: React.ReactNode
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ value, className, children, ...props }, ref) => {
        const { value: selectedValue } = React.useContext(TabsContext)
        const isActive = value === selectedValue

        if (!isActive) return null

        return (
            <div
                ref={ref}
                role="tabpanel"
                id={`tabpanel-${value}`}
                aria-labelledby={`tab-${value}`}
                className={cn(
                    "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }