import { countryColumns } from "@/components/table/columns/country-columns";
import { DataTable } from "@/components/table/data-table";
import { getCountries } from "@/lib/actions/countries";
import { getFoods } from "@/lib/actions/foods";

export default async function Page() {
  const countries = await getCountries();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <DataTable data={countries} columns={countryColumns} />
    </div>
  );
}
