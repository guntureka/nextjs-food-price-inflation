"use client";

import { Row } from "@tanstack/react-table";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

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
import { getFileKey } from "@/lib/helpers";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LoadingButton } from "../loading-button";
// import { deleteFiles } from "@/lib/actions/uploadthing";
import { deleteFiles } from "@/lib/actions/minio";
import { toast } from "sonner";

interface DataTableRowActionsProps<
  TData extends {
    id: string;
    geojsonUrl?: string | null;
    image?: string | null;
  },
> {
  row: Row<TData>;
  deleteFunc: (id: string) => Promise<any | void>;
}

export function DataTableRowAction<
  TData extends {
    id: string;
    geojsonUrl?: string | null;
    image?: string | null;
  },
>({ row, deleteFunc }: DataTableRowActionsProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();

  const { id, geojsonUrl, image } = row.original;

  const onDelete = async () => {
    setIsLoading(true);

    try {
      const keys: string[] = [];

      if (geojsonUrl) {
        const key = getFileKey(geojsonUrl);
        if (key) keys.push(key);
      }

      if (image) {
        const key = getFileKey(image);
        if (key) keys.push(key);
      }

      if (keys.length > 0) {
        const res = await deleteFiles(keys);

        if (!res) {
          throw new Error("Error when deleting files");
        }
      }

      await deleteFunc(id);

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
          <DropdownMenuItem>
            <Button variant={"ghost"} asChild>
              <Link
                href={`${pathname}/update/${id}`}
                className={"flex w-full items-start justify-center gap-2"}
              >
                <Pencil className="h-4 w-4 text-green-500" />
                <span>Update</span>
              </Link>
            </Button>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className={"flex w-full items-start justify-center gap-2"}
              >
                <Trash2 className="text-destructive" />
                <span>Delete</span>
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
