import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-coffee text-white shadow-xl shadow-coffee/10 hover:opacity-90",
        destructive: "bg-terracotta text-white shadow-xl shadow-terracotta/10 hover:opacity-90",
        outline: "border-2 border-sand bg-transparent text-coffee hover:bg-cream hover:border-coffee/20",
        secondary: "bg-cream text-coffee border border-sand hover:bg-white shadow-sm",
        ghost: "text-coffee/40 hover:text-coffee hover:bg-cream rounded-2xl",
        link: "text-coffee underline-offset-8 hover:underline italic",
        terracotta: "bg-terracotta text-white shadow-xl shadow-terracotta/20 hover:scale-[1.02]",
        coffee: "bg-coffee text-white shadow-xl shadow-coffee/20 hover:scale-[1.02]",
        forest: "bg-forest text-white shadow-xl shadow-forest/20 hover:scale-[1.02]",
        paper: "bg-white border-2 border-sand text-coffee shadow-sm hover:border-coffee/20 hover:shadow-lg",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 rounded-xl px-4 text-[10px]",
        lg: "h-14 rounded-2xl px-10 text-base",
        xl: "h-16 rounded-[2rem] px-12 text-lg",
        icon: "h-11 w-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }