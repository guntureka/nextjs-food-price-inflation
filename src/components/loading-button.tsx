"use client";

import { VariantProps } from "class-variance-authority";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export function LoadingButton({
  isLoading,
  children,
  className,
  type = "submit",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { isLoading?: boolean }) {
  return (
    <Button
      className={cn("w-full", className)}
      type={type}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <LoaderCircle className="animate-spin" /> : children}
    </Button>
  );
}
