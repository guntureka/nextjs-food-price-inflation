"use server";

import { db } from "@/db";
import {
  countriesTable,
  // foodPriceIndexesTable,
  InsertCountry,
} from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";

export async function getCountries() {
  try {
    const res = await db
      .select({
        id: countriesTable.id,
        name: countriesTable.name,
        countryCode: countriesTable.countryCode,
        currency: countriesTable.currency,
        createdAt: countriesTable.createdAt,
        updatedAt: countriesTable.updatedAt,
      })
      .from(countriesTable);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export async function getCountriesWithFoodPriceIndexes(
//   countryId?: string,
//   month?: number,
//   year?: number,
// ) {
//   try {
//     let filters: SQL[] = [];

//     if (countryId) {
//       filters.push(eq(countriesTable.id, countryId));
//     }

//     if (month) {
//       filters.push(eq(foodPriceIndexesTable.month, month));
//     }

//     if (year) {
//       filters.push(eq(foodPriceIndexesTable.year, year));
//     }

//     const foodPriceIndexesPrevYear = db
//       .select()
//       .from(foodPriceIndexesTable)
//       .as("food_price_indexes_prev_year");

//     const query = db
//       .select({
//         ...getTableColumns(countriesTable),
//         foodPriceIndex: getTableColumns(foodPriceIndexesTable),
//       })
//       .from(countriesTable)
//       .leftJoin(
//         foodPriceIndexesTable,
//         eq(countriesTable.id, foodPriceIndexesTable.countryId),
//       );

//     const res = await query.where(and(...filters));

//     return res;

//     // const result = res.reduce<
//     //   Array<SelectCountry & { foodPriceIndexes: SelectFoodPriceIndex[] }>
//     // >((acc, row) => {
//     //   const country = row.country;
//     //   const foodPriceIndex = row.foodPriceIndexes;

//     //   if (!country) return acc;

//     //   const existing = acc.find((item) => item.id === country.id);

//     //   if (existing) {
//     //     existing.foodPriceIndexes.push(
//     //       ...(Array.isArray(foodPriceIndex)
//     //         ? foodPriceIndex
//     //         : [foodPriceIndex]),
//     //     );
//     //   } else {
//     //     acc.push({
//     //       ...country,
//     //       foodPriceIndexes: Array.isArray(foodPriceIndex)
//     //         ? foodPriceIndex.filter((index) => index !== null)
//     //         : [foodPriceIndex].filter((index) => index !== null),
//     //     });
//     //   }

//     //   return acc;
//     // }, []);

//     // return result;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

export async function getCountry(id: string) {
  try {
    const [res] = await db
      .select()
      .from(countriesTable)
      .where(eq(countriesTable.id, id))
      .limit(1);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createCountry(data: InsertCountry) {
  try {
    const [res] = await db
      .insert(countriesTable)
      .values(data)
      .returning({ id: countriesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function createCountries(datas: InsertCountry[]) {
  try {
    const res = await db
      .insert(countriesTable)
      .values(datas)
      .onConflictDoUpdate({
        target: countriesTable.countryCode,
        set: { name: sql`excluded.name`, currency: sql`excluded.currency` },
      })
      .returning({ id: countriesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateCountry(id: string, data: InsertCountry) {
  try {
    const [res] = await db
      .update(countriesTable)
      .set(data)
      .where(eq(countriesTable.id, id))
      .returning({ id: countriesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteCountry(id: string) {
  try {
    const [res] = await db
      .delete(countriesTable)
      .where(eq(countriesTable.id, id))
      .returning({ id: countriesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteCountries(ids: string[]) {
  try {
    const res = await db
      .delete(countriesTable)
      .where(inArray(countriesTable.id, ids))
      .returning({ id: countriesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
