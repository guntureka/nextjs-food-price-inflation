import { UpdateUserForm } from "@/components/form/update-user-form";
import { getUser } from "@/lib/actions/user";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUser(id);

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col p-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <UpdateUserForm user={user} />
      </div>
    </div>
  );
}
