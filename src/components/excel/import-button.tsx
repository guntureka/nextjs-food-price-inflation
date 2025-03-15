"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface ImportButtonProps {
  children?: ReactNode;
}

export function ImportButton({ children }: ImportButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" type="button">
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[60vh] w-full max-w-4xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Upload file Excel untuk mengimport data.
          </DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
