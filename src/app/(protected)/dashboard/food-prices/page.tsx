import { FoodPriceImportButton } from "@/components/excel/food-price-import-button";
import { foodPriceColumns } from "@/components/table/columns/food-price-columns";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { getFoodPricesWithRelations } from "@/lib/actions/food-prices";
import Link from "next/link";

export default async function Page() {
  const foodPrices = await getFoodPricesWithRelations();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col gap-10 p-4 py-10">
      <div className="flex gap-2">
        <FoodPriceImportButton />
        <Link href={"/dashboard/food-prices/create"}>
          <Button>Create</Button>
        </Link>
      </div>
      <DataTable
        data={foodPrices}
        columns={foodPriceColumns}
        fields={[
          "country.name",
          "food.name",
          "month",
          "year",
          "date",
          "open",
          "low",
          "high",
          "close",
          "inflation",
        ]}
      />
    </div>
  );
}
