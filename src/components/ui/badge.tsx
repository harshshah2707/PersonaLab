import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-coffee text-white shadow-sm",
        secondary: "border-transparent bg-cream text-coffee",
        destructive: "border-transparent bg-terracotta text-white shadow-sm",
        outline: "border-sand bg-transparent text-coffee/60 hover:border-coffee/20 hover:text-coffee",
        forest: "border-forest/20 bg-forest/10 text-forest",
        terracotta: "border-terracotta/20 bg-terracotta/10 text-terracotta",
        coffee: "border-sand bg-coffee/5 text-coffee",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }