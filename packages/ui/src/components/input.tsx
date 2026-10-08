import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@jmwired/ui/lib/utils";
import * as React from "react";

function Input({
  className,
  type,
  density = "default",
  ...props
}: React.ComponentProps<"input"> & { density?: "default" | "comfortable" }) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-none border border-input bg-transparent px-2.5 py-1 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        density === "comfortable" ? "h-11 text-sm" : "h-8 text-xs",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
