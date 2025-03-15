"use server";

import { db } from "@/db";
import {
  countriesTable,
  foodPricesTable,
  foodsTable,
  InsertFoodPrice,
} from "@/db/schema";
import { and, eq, getTableColumns, inArray, sql } from "drizzle-orm";

export async function getFoodPrices() {
  try {
    const res = await db.select().from(foodPricesTable);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getFoodPricesWithRelations() {
  try {
    const foodPricesPrevYear = db
      .select()
      .from(foodPricesTable)
      .as("food_prices_prev_year");

    const res = await db
      .select({
        ...getTableColumns(foodPricesTable),
        country: {
          id: countriesTable.id,
          name: countriesTable.name,
          currency: countriesTable.currency,
        },
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
      );

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getFoodPrice(id: string) {
  try {
    const [res] = await db
      .select()
      .from(foodPricesTable)
      .where(eq(foodPricesTable.id, id))
      .limit(1);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createFoodPrice(data: InsertFoodPrice) {
  try {
    const [res] = await db
      .insert(foodPricesTable)
      .values(data)
      .returning({ id: foodPricesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createFoodPrices(data: InsertFoodPrice[]) {
  try {
    const res = await db
      .insert(foodPricesTable)
      .values(data)
      .onConflictDoUpdate({
        target: [
          foodPricesTable.month,
          foodPricesTable.year,
          foodPricesTable.foodId,
          foodPricesTable.countryId,
        ],
        set: {
          open: foodPricesTable.open,
          low: foodPricesTable.low,
          high: foodPricesTable.high,
          close: foodPricesTable.close,
          date: foodPricesTable.date,
        },
      })
      .returning({ id: foodPricesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateFoodPrice(id: string, data: InsertFoodPrice) {
  try {
    const [res] = await db
      .update(foodPricesTable)
      .set(data)
      .where(eq(foodPricesTable.id, id))
      .returning({ id: foodPricesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteFoodPrice(id: string) {
  try {
    const [res] = await db
      .delete(foodPricesTable)
      .where(eq(foodPricesTable.id, id))
      .returning({ id: foodPricesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteFoodPrices(ids: string[]) {
  try {
    const [res] = await db
      .delete(foodPricesTable)
      .where(inArray(foodPricesTable.id, ids))
      .returning({ id: foodPricesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
