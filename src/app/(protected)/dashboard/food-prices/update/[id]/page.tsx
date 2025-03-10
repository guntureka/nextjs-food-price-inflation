import { UpdateCountryForm } from "@/components/form/update-country-form";
import { UpdateFoodPriceForm } from "@/components/form/update-food-price-form";
import { getCountries, getCountry } from "@/lib/actions/countries";
import { getFoodPrice } from "@/lib/actions/food-prices";
import { getFoods } from "@/lib/actions/foods";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [foods, countries, foodPrice] = await Promise.all([
    getFoods(),
    getCountries(),
    getFoodPrice(id),
  ]);

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <UpdateFoodPriceForm
          foods={foods}
          countries={countries}
          foodPrice={foodPrice}
        />
      </div>
    </div>
  );
}
