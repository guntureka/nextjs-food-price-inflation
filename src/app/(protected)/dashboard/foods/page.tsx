import { FoodImportButton } from "@/components/excel/food-import-button";
import { foodColumns } from "@/components/table/columns/food-columns";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { getFoods } from "@/lib/actions/foods";
import Link from "next/link";

export default async function Page() {
  const foods = await getFoods();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col gap-10 p-4 py-10">
      <div className="flex gap-2">
        <FoodImportButton />
        <Link href={"/dashboard/foods/create"}>
          <Button>Create</Button>
        </Link>
      </div>
      <DataTable
        data={foods}
        columns={foodColumns}
        fields={["name", "description"]}
      />
    </div>
  );
}
