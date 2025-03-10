import { UpdateFoodForm } from "@/components/form/update-food-form";
import { getFood } from "@/lib/actions/foods";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const food = await getFood(id);

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <UpdateFoodForm food={food} />
      </div>
    </div>
  );
}
