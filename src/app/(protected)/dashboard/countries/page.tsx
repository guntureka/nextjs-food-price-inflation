import { CountryImportButton } from "@/components/excel/country-import-button";
import { countryColumns } from "@/components/table/columns/country-columns";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { getCountries } from "@/lib/actions/countries";
import Link from "next/link";

export default async function Page() {
  const countries = await getCountries();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col gap-10 p-4 py-10">
      <div className="flex gap-2">
        <CountryImportButton />
        <Link href={"/dashboard/countries/create"}>
          <Button>Create</Button>
        </Link>
      </div>
      <DataTable
        data={countries}
        columns={countryColumns}
        fields={["name", "countryCode", "currency"]}
      />
    </div>
  );
}
