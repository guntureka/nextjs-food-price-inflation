"use client";

// import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableColumnAction } from "@/components/table/data-table-header-column-action";
import { DataTableRowAction } from "@/components/table/data-table-row-action";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectCountry } from "@/db/schema";
import { deleteCountries, deleteCountry } from "@/lib/actions/countries";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const countryColumns: ColumnDef<Omit<SelectCountry, "geojson">>[] = [
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
        className="mx-auto flex"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "countryCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country Code" />
    ),
  },
  {
    accessorKey: "currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
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
      <DataTableColumnAction table={table} deletesFunc={deleteCountries} />
    ),
    cell: ({ row }) => (
      <DataTableRowAction row={row} deleteFunc={deleteCountry} />
    ),
  },
];
