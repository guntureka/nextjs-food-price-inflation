import { CreateCountryForm } from "@/components/form/create-country-form";
import { CreateFoodForm } from "@/components/form/create-food-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <CreateCountryForm />
      </div>
    </div>
  );
}
