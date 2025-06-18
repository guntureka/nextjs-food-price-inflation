import { SIGForm } from "@/components/form/sig-form";
import { getFoods } from "@/lib/actions/foods";
import { Suspense } from "react";

export default async function Home() {
  const [foods] = await Promise.all([getFoods()]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <main className="mx-auto flex flex-col gap-10">
        {/* Jika mau tambahkan header atau deskripsi */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Geographic Information System for Food Price Inflation
          </h1>
          <p className="mt-2 text-gray-600">
            Select a food type, year, and month to view price inflation data on
            the map.
          </p>
        </header>

        {/* Form filter */}
        <section className="rounded-lg bg-white p-6 shadow">
          <Suspense>
            <SIGForm foods={foods} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
