import { UpdateCountryForm } from "@/components/form/update-country-form";
import { getCountry } from "@/lib/actions/countries";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const country = await getCountry(id);

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <UpdateCountryForm country={country} />
      </div>
    </div>
  );
}
