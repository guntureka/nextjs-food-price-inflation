import { CreateCountryForm } from "@/components/form/create-country-form";
import { CreateFoodForm } from "@/components/form/create-food-form";
import { CreateFoodPriceForm } from "@/components/form/create-food-price-form";
import { getCountries } from "@/lib/actions/countries";
import { getFoods } from "@/lib/actions/foods";

export default async function Page() {
  const [foods, countries] = await Promise.all([getFoods(), getCountries()]);
  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <CreateFoodPriceForm foods={foods} countries={countries} />
      </div>
    </div>
  );
}
