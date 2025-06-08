import { SIGForm } from "@/components/form/sig-form";
import { getFoods } from "@/lib/actions/foods";

export default async function Home() {
  const [foods] = await Promise.all([getFoods()]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <main className="mx-auto flex max-w-5xl flex-col gap-10">
        {/* Jika mau tambahkan header atau deskripsi */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistem Informasi Geografis Harga Inflasi Pangan
          </h1>
          <p className="mt-2 text-gray-600">
            Pilih jenis pangan, tahun, dan bulan untuk melihat data inflasi
            harga di peta.
          </p>
        </header>

        {/* Form filter */}
        <section className="rounded-lg bg-white p-6 shadow">
          <SIGForm foods={foods} />
        </section>
      </main>
    </div>
  );
}
