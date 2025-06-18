import { userColumns } from "@/components/table/columns/user-columns";
import { DataTable } from "@/components/table/data-table";
import { getUsers } from "@/lib/actions/user";

export default async function Page() {
  const users = await getUsers();

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col gap-10 p-4 py-10">
      {/* <div className="flex gap-2">
        <Link href={"/dashboard/users/create"}>
          <Button>Create</Button>
        </Link>
      </div> */}
      <DataTable
        data={users}
        columns={userColumns}
        fields={["name", "email"]}
      />
    </div>
  );
}
