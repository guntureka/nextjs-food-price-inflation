"use client";

import { Table } from "@tanstack/react-table";

import { DataTableViewOption } from "@/components/table/data-table-view-option";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NestedKey } from "@/lib/types";
import { X } from "lucide-react";
import { ExportButton } from "../excel/export-button";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  fields?: NestedKey<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  fields,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    table.getState().globalFilter != "";

  return (
    <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center">
      <div className="flex w-full flex-1 items-center space-x-2">
        <Input
          placeholder={"Filter"}
          value={table.getState().globalFilter ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(String(event.target.value))
          }
          className="h-8 w-full md:w-[250px]"
        />

        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => {
              table.resetColumnFilters();
              table.resetGlobalFilter();
            }}
            className="flex h-8 gap-2 px-2"
          >
            <p className="hidden md:block">Clean Filters</p>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex w-full items-center justify-between gap-4 md:w-fit md:justify-center">
        <ExportButton
          fields={fields}
          datas={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
        />
        <DataTableViewOption table={table} />
      </div>
    </div>
  );
}
