"use server";

import { db } from "@/db";
import { countriesTable, foodPricesTable, foodsTable } from "@/db/schema";
import { and, eq, getTableColumns, SQL, sql } from "drizzle-orm";

type FilterParams = {
  foodId?: string;
  year?: number;
  month?: number;
};

export async function getSIGDatas(filters?: FilterParams) {
  try {
    // Fallback ambil foodId jika tidak disediakan
    if (!filters?.foodId) {
      const fallbackFood = await db
        .select({ id: foodsTable.id })
        .from(foodsTable)
        .limit(1);

      if (fallbackFood.length > 0) {
        filters = { ...filters, foodId: fallbackFood[0].id };
      }
    }

    // Fallback ambil year & month terbaru jika tidak disediakan
    if (!filters?.year || !filters?.month) {
      const latest = await db
        .select({
          year: foodPricesTable.year,
          month: foodPricesTable.month,
        })
        .from(foodPricesTable)
        .orderBy(
          sql`${foodPricesTable.year} DESC`,
          sql`${foodPricesTable.month} DESC`,
        )
        .limit(1);

      if (latest[0]) {
        filters = {
          ...filters,
          year: filters?.year ?? latest[0].year,
          month: filters?.month ?? latest[0].month,
        };
      }
    }

    const countries = await db
      .select({
        id: countriesTable.id,
        name: countriesTable.name,
        currency: countriesTable.currency,
        geojson: countriesTable.geojson,
      })
      .from(countriesTable);

    const foodPricesPrevYear = db
      .select()
      .from(foodPricesTable)
      .as("food_prices_prev_year");

    const whereConditions: SQL[] = [];

    if (filters?.foodId) {
      whereConditions.push(eq(foodPricesTable.foodId, filters.foodId));
    }

    if (filters?.year) {
      whereConditions.push(eq(foodPricesTable.year, filters.year));
    }

    if (filters?.month) {
      whereConditions.push(eq(foodPricesTable.month, filters.month));
    }

    const prices = await db
      .select({
        ...getTableColumns(foodPricesTable),
        food: {
          id: foodsTable.id,
          name: foodsTable.name,
        },
        inflation: sql<number | null>`
          CASE
            WHEN food_prices_prev_year.close IS NOT NULL AND food_prices_prev_year.close != 0
            THEN ROUND(((${foodPricesTable.close} - food_prices_prev_year.close)/ food_prices_prev_year.close * 100)::numeric, 2)
            ELSE NULL
          END
        `.as("inflation"),
      })
      .from(foodPricesTable)
      .leftJoin(
        countriesTable,
        eq(foodPricesTable.countryId, countriesTable.id),
      )
      .leftJoin(foodsTable, eq(foodPricesTable.foodId, foodsTable.id))
      .leftJoin(
        foodPricesPrevYear,
        and(
          eq(sql`food_prices_prev_year.country_id`, foodPricesTable.countryId),
          eq(sql`food_prices_prev_year.food_id`, foodPricesTable.foodId),
          eq(sql`food_prices_prev_year.month`, foodPricesTable.month),
          eq(sql`food_prices_prev_year.year`, sql`${foodPricesTable.year} - 1`),
        ),
      )
      .where(and(...whereConditions));

    return { countries, prices };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
