"use client";

// import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableColumnAction } from "@/components/table/data-table-header-column-action";
import { DataTableRowAction } from "@/components/table/data-table-row-action";
import { Checkbox } from "@/components/ui/checkbox";
import {
  deleteFoodPriceIndex,
  deleteFoodPriceIndexes,
  getFoodPriceIndexesWithRelations,
} from "@/lib/actions/food-price-indexes";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type FoodPriceIndexType = Awaited<
  ReturnType<typeof getFoodPriceIndexesWithRelations>
>[0];

export const foodPriceIndexColumns: ColumnDef<FoodPriceIndexType>[] = [
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
        className="mx-auto flex justify-center"
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
    accessorKey: "month",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Month" />
    ),
    cell: ({ row }) => <span>{MONTHS[row.original.month]}</span>,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const monthIndex = Number(row.getValue(columnId)); // Konversi ke angka
      if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return false; // Validasi indeks bulan
      const monthName = MONTHS[monthIndex].toLowerCase();
      return monthName.includes(filterValue.toLowerCase());
    },
    enableGlobalFilter: false,
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
    filterFn: (row, columnId, filterValue) => {
      return row.getValue(columnId) === parseInt(filterValue);
    },
    enableGlobalFilter: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <span>{row.original.date ? format(row.original.date, "PP") : ""}</span>
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "open",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Open" />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "low",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Low" />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "high",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="High" />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "close",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Close" />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "inflation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inflation" />
    ),
    enableColumnFilter: false,
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
      <DataTableColumnAction
        table={table}
        deletesFunc={deleteFoodPriceIndexes}
      />
    ),
    cell: ({ row }) => (
      <DataTableRowAction row={row} deleteFunc={deleteFoodPriceIndex} />
    ),
  },
];
