import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { countCountries } from "@/lib/actions/countries";
import { countFoodPrices } from "@/lib/actions/food-prices";
import { countFoods } from "@/lib/actions/foods";
import { countUsers } from "@/lib/actions/user";
import { Banana, DollarSign, Map, User } from "lucide-react";
import { ReactNode } from "react";

export default async function Page() {
  const [session, totalCountries, totalFoods, totalFoodPrices, totalUsers] =
    await Promise.all([
      auth(),
      countCountries(),
      countFoods(),
      countFoodPrices(),
      countUsers(),
    ]);

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome {session?.user.name}. Here you can monitor and manage your
          data.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Users"
          value={totalUsers.count}
          icon={<User className="h-5 w-5" />}
        />
        <StatCard
          title="Countries"
          value={totalCountries.count}
          icon={<Map className="h-5 w-5" />}
        />
        <StatCard
          title="Foods"
          value={totalFoods.count}
          icon={<Banana className="h-5 w-5" />}
        />
        <StatCard
          title="Food Prices"
          value={totalFoodPrices.count}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="text-gray-500">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
