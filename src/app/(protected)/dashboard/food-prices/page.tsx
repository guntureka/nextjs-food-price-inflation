import { getFoodPrices } from "@/lib/actions/food-prices";

export default async function Page() {
  const foodPrices = await getFoodPrices();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <pre>{JSON.stringify(foodPrices, null, 2)}</pre>{" "}
      </div>
    </div>
  );
}
