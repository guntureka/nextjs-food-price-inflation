import { FoodPriceIndexImportButton } from "@/components/excel/food-price-index-import-button";
import { foodPriceIndexColumns } from "@/components/table/columns/food-price-index-columns";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { getFoodPriceIndexesWithRelations } from "@/lib/actions/food-price-indexes";
import Link from "next/link";

export default async function Page() {
  const foodPriceIndexes = await getFoodPriceIndexesWithRelations();
  return (
    <div className="flex min-h-svh w-full flex-1 flex-col gap-10 p-4 py-10">
      <div className="flex gap-2">
        <FoodPriceIndexImportButton />
        <Link href={"/dashboard/food-price-indexes/create"}>
          <Button>Create</Button>
        </Link>
      </div>
      <DataTable
        data={foodPriceIndexes}
        columns={foodPriceIndexColumns}
        fields={[
          "country.name",
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
