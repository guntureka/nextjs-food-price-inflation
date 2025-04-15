import { MapCaller } from "@/components/leaflet/map-caller";
import { getCountries } from "@/lib/actions/countries";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const countries = await getCountries();

  const result = await Promise.all(
    countries.map(async (v) => {
      const geojsonFetch = v.geojsonUrl ? await fetch(v.geojsonUrl) : null;
      const geojsonJson = geojsonFetch ? await geojsonFetch.json() : null;

      return {
        data: { ...v },
        geojson: geojsonJson,
      };
    }),
  );

  return (
    <div className="grid min-h-screen w-full grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-gray-300">
          <MapCaller datas={result} />
        </div>
        <pre>{JSON.stringify(countries, null, 2)}</pre>
      </main>
    </div>
  );
}
