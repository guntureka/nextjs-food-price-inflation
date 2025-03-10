import { getFoodPriceIndexes } from "@/lib/actions/food-price-indexes";
import { getFoodPrices } from "@/lib/actions/food-prices";

export default async function Page() {
  const foodPriceIndexes = await getFoodPriceIndexes();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <pre>{JSON.stringify(foodPriceIndexes, null, 2)}</pre>{" "}
      </div>
    </div>
  );
}
