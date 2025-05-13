import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
    expandedItems: string[]
    toggleItem: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue>({
    expandedItems: [],
    toggleItem: () => { },
})

interface AccordionProps {
    type?: "single" | "multiple"
    defaultValue?: string | string[]
    value?: string | string[]
    onValueChange?: (value: string | string[]) => void
    className?: string
    children: React.ReactNode
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
    ({ type = "single", defaultValue, value, onValueChange, className, children }, ref) => {
        const [expandedItems, setExpandedItems] = React.useState<string[]>(() => {
            if (defaultValue) {
                return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
            }
            return []
        })

        React.useEffect(() => {
            if (value !== undefined) {
                setExpandedItems(Array.isArray(value) ? value : [value])
            }
        }, [value])

        const toggleItem = React.useCallback((itemValue: string) => {
            setExpandedItems(current => {
                let newItems: string[]

                if (type === "single") {
                    newItems = current.includes(itemValue) ? [] : [itemValue]
                } else {
                    newItems = current.includes(itemValue)
                        ? current.filter(item => item !== itemValue)
                        : [...current, itemValue]
                }

                onValueChange?.(type === "single" ? newItems[0] || "" : newItems)
                return newItems
            })
        }, [type, onValueChange])

        return (
            <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
                <div ref={ref} className={cn("w-full", className)}>
                    {children}
                </div>
            </AccordionContext.Provider>
        )
    }
)
Accordion.displayName = "Accordion"

interface AccordionItemProps {
    value: string
    className?: string
    children: React.ReactNode
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
    ({ value, className, children }, ref) => {
        return (
            <div ref={ref} className={cn("border-b", className)} data-value={value}>
                {children}
            </div>
        )
    }
)
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string
    children: React.ReactNode
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
    ({ className, children, ...props }, ref) => {
        const { expandedItems, toggleItem } = React.useContext(AccordionContext)
        const item = React.useContext(AccordionItemContext)
        const isExpanded = item ? expandedItems.includes(item.value) : false

        return (
            <button
                ref={ref}
                type="button"
                aria-expanded={isExpanded}
                onClick={() => item && toggleItem(item.value)}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown
                    className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        isExpanded && "rotate-180"
                    )}
                />
            </button>
        )
    }
)
AccordionTrigger.displayName = "AccordionTrigger"

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
    children: React.ReactNode
}

const AccordionItemContext = React.createContext<{ value: string } | null>(null)

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
    ({ className, children, ...props }, ref) => {
        const { expandedItems } = React.useContext(AccordionContext)
        const itemContext = React.useContext(AccordionItemContext)

        if (!itemContext) return null

        const isExpanded = expandedItems.includes(itemContext.value)

        return (
            <div
                ref={ref}
                className={cn(
                    "overflow-hidden text-sm transition-all",
                    isExpanded ? "animate-accordion-down" : "animate-accordion-up",
                    className
                )}
                {...props}
            >
                <div className="pb-4 pt-0">{children}</div>
            </div>
        )
    }
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }