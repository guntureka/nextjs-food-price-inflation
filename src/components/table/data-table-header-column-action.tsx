"use client";

import { Table } from "@tanstack/react-table";
import { Ellipsis, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingButton } from "../loading-button";
// import { deleteFiles } from "@/lib/actions/uploadthing";
import { deleteFiles } from "@/lib/actions/minio";
import { getFileKey } from "@/lib/helpers";

interface DataTableColumnActionProps<
  TData extends {
    id: string;
    geojsonUrl?: string | null;
    image?: string | null;
  },
> {
  table: Table<TData>;
  deletesFunc: (ids: string[]) => Promise<any | void>;
}

export function DataTableColumnAction<
  TData extends {
    id: string;
    geojsonUrl?: string | null;
    image?: string | null;
  },
>({ table, deletesFunc }: DataTableColumnActionProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);

  const selected = table
    .getSelectedRowModel()
    .flatRows.flatMap((v) => v.original);
  const ids = selected.flatMap((v) => v.id).filter(Boolean);
  const files = selected
    .flatMap((v) => [v.geojsonUrl, v.image])
    .filter(Boolean) as string[];

  const onDelete = async () => {
    if (ids.length < 1) return;

    setIsLoading(true);

    try {
      const keys = files.reduce<string[]>((acc, file) => {
        const key = getFileKey(file);
        if (key) acc.push(key);
        return acc;
      }, []);

      if (keys.length > 0) {
        const res = await deleteFiles(keys);

        if (!res) {
          throw new Error("Error when deleting files");
        }
      }

      await deletesFunc(ids);

      toast.success("Success");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", { description: error.message });
      } else {
        toast.error("Error", { description: "Something went wrong" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="mx-auto flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">{"Open Menu"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger
            asChild
            disabled={!table.getSelectedRowModel().flatRows.length}
          >
            <DropdownMenuItem>
              <Button variant="ghost">
                <Trash2 className="h-4 w-4 text-red-500" />
                {<span className="ml-2">{"Delete"}</span>}
              </Button>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this data?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            isLoading={isLoading}
            variant={"destructive"}
            className={"flex w-full items-start justify-center gap-2"}
            onClick={() => onDelete()}
          >
            <Trash2 />
            <span>Delete</span>
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
