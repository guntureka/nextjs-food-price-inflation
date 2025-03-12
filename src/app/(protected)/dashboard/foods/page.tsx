import { foodColumns } from "@/components/table/columns/food-columns";
import { DataTable } from "@/components/table/data-table";
import { getFoods } from "@/lib/actions/foods";

export default async function Page() {
  const foods = await getFoods();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <DataTable data={foods} columns={foodColumns} />
    </div>
  );
}
