import { UpdateFoodPriceIndexForm } from "@/components/form/update-food-price-index-form";
import { getCountries } from "@/lib/actions/countries";
import { getFoodPriceIndex } from "@/lib/actions/food-price-indexes";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [countries, foodPriceIndex] = await Promise.all([
    getCountries(),
    getFoodPriceIndex(id),
  ]);

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <UpdateFoodPriceIndexForm
          countries={countries}
          foodPriceIndex={foodPriceIndex}
        />
      </div>
    </div>
  );
}
