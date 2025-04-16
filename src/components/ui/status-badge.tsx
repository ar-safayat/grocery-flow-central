
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border border-primary/20",
        secondary: "bg-secondary/10 text-secondary border border-secondary/20",
        success: "bg-green-100 text-green-800 border border-green-200",
        warning: "bg-amber-100 text-amber-800 border border-amber-200",
        danger: "bg-red-100 text-red-800 border border-red-200",
        info: "bg-blue-100 text-blue-800 border border-blue-200",
        outline: "border border-input text-muted-foreground",
      },
      size: {
        default: "h-6",
        sm: "h-5",
        lg: "h-7",
      },
      withDot: {
        true: "pl-1.5",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      withDot: false,
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
      status?: string;
    }

function StatusBadge({ 
  className, 
  variant, 
  size,
  withDot, 
  status,
  children,
  ...props 
}: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant, size, withDot }), className)} {...props}>
      {withDot && (
        <div className={cn(
          "mr-1 h-2 w-2 rounded-full",
          variant === "success" ? "bg-green-600" : 
          variant === "warning" ? "bg-amber-600" :
          variant === "danger" ? "bg-red-600" :
          variant === "info" ? "bg-blue-600" : "bg-primary"
        )} />
      )}
      {status || children}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };
