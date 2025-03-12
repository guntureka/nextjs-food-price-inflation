import { foodPriceColumns } from "@/components/table/columns/food-price-columns";
import { DataTable } from "@/components/table/data-table";
import { getFoodPricesWithRelations } from "@/lib/actions/food-prices";

export default async function Page() {
  const foodPrices = await getFoodPricesWithRelations();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <DataTable data={foodPrices} columns={foodPriceColumns} />
    </div>
  );
}
