import { foodPriceIndexColumns } from "@/components/table/columns/food-price-index-columns";
import { DataTable } from "@/components/table/data-table";
import { getFoodPriceIndexesWithRelations } from "@/lib/actions/food-price-indexes";

export default async function Page() {
  const foodPriceIndexes = await getFoodPriceIndexesWithRelations();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
        <DataTable data={foodPriceIndexes} columns={foodPriceIndexColumns} />
      </div>
    </div>
  );
}
