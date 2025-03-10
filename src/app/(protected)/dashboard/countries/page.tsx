import { getCountries } from "@/lib/actions/countries";
import { getFoods } from "@/lib/actions/foods";

export default async function Page() {
  const countries = await getCountries();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <pre>{JSON.stringify(countries, null, 2)}</pre>
      </div>
    </div>
  );
}
