import { getFoods } from "@/lib/actions/foods";

export default async function Page() {
  const foods = await getFoods();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <pre>{JSON.stringify(foods, null, 2)}</pre>
      </div>
    </div>
  );
}
