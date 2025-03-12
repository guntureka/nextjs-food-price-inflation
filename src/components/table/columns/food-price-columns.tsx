"use client";

// import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableColumnAction } from "@/components/table/data-table-header-column-action";
import { DataTableRowAction } from "@/components/table/data-table-row-action";
import { Checkbox } from "@/components/ui/checkbox";
import {
  deleteFoodPrice,
  deleteFoodPrices,
  type getFoodPricesWithRelations,
} from "@/lib/actions/food-prices";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

type FoodPriceType = Awaited<ReturnType<typeof getFoodPricesWithRelations>>[0];

export const foodPriceColumns: ColumnDef<FoodPriceType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
        aria-label="select all"
        className="mx-auto flex"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
        className="m-2 flex justify-center"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "country.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
  },
  {
    accessorKey: "food.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Food" />
    ),
  },
  {
    accessorKey: "month",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Month" />
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <span>{row.original.date ? format(row.original.date, "P") : ""}</span>
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "country.currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "open",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Open" />
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "low",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Low" />
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "high",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="High" />
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "close",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Close" />
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "inflation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inflation" />
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.createdAt ? format(row.original.createdAt, "Pp") : ""}
      </span>
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.updatedAt ? format(row.original.updatedAt, "Pp") : ""}
      </span>
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    id: "action",
    header: ({ table }) => (
      <DataTableColumnAction table={table} deletesFunc={deleteFoodPrices} />
    ),
    cell: ({ row }) => (
      <DataTableRowAction row={row} deleteFunc={deleteFoodPrice} />
    ),
  },
];
