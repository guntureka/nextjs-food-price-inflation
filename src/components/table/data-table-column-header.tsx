"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [sort, setSort] = React.useState(false);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const onClickSortButton = () => {
    column.toggleSorting(sort);
    setSort(!sort);
  };

  return (
    <div
      className={cn("flex w-full flex-col items-center gap-2 py-2", className)}
    >
      <Button
        variant={"ghost"}
        size={"sm"}
        className="-ml-3 h-8 w-full justify-start data-[state=open]:bg-accent"
        onClick={() => onClickSortButton()}
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDown />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUp />
        ) : (
          <ChevronsUpDown />
        )}
      </Button>
      {column.getCanFilter() && (
        <Input
          type="text"
          placeholder={`${title}...`}
          value={(column.getFilterValue() as string) ?? ""}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="-ml-3"
        />
      )}
    </div>
  );
}
