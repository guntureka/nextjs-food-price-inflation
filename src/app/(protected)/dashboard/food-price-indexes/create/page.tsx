import { CreateFoodPriceIndexForm } from "@/components/form/create-food-price-index-form";
import { getCountries } from "@/lib/actions/countries";

export default async function Page() {
  const countries = await getCountries();
  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <CreateFoodPriceIndexForm countries={countries} />
      </div>
    </div>
  );
}
