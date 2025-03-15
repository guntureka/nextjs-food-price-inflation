"use server";

import { db } from "@/db";
import {
  countriesTable,
  foodPriceIndexesTable,
  InsertFoodPriceIndex,
} from "@/db/schema";
import { and, eq, getTableColumns, inArray, sql } from "drizzle-orm";

export async function getFoodPriceIndexes() {
  try {
    const res = await db.select().from(foodPriceIndexesTable);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getFoodPriceIndexesWithRelations() {
  try {
    const foodPriceIndexesPrevYear = db
      .select()
      .from(foodPriceIndexesTable)
      .as("food_price_indexes_prev_year");

    const res = await db
      .select({
        ...getTableColumns(foodPriceIndexesTable),
        country: {
          id: countriesTable.id,
          name: countriesTable.name,
        },
        inflation: sql<number | null>`
          CASE
            WHEN food_price_indexes_prev_year.close IS NOT NULL AND food_price_indexes_prev_year.close != 0
            THEN ROUND(((${foodPriceIndexesTable.close} - food_price_indexes_prev_year.close)/ food_price_indexes_prev_year.close * 100)::numeric, 2)
            ELSE NULL
          END
        `.as("inflation"),
      })
      .from(foodPriceIndexesTable)
      .leftJoin(
        countriesTable,
        eq(foodPriceIndexesTable.countryId, countriesTable.id),
      )
      .leftJoin(
        foodPriceIndexesPrevYear,
        and(
          eq(
            sql`food_price_indexes_prev_year.country_id`,
            foodPriceIndexesTable.countryId,
          ),
          eq(
            sql`food_price_indexes_prev_year.month`,
            foodPriceIndexesTable.month,
          ),
          eq(
            sql`food_price_indexes_prev_year.year`,
            sql`${foodPriceIndexesTable.year} - 1`,
          ),
        ),
      );

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getFoodPriceIndex(id: string) {
  try {
    const [res] = await db
      .select()
      .from(foodPriceIndexesTable)
      .where(eq(foodPriceIndexesTable.id, id))
      .limit(1);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createFoodPriceIndex(data: InsertFoodPriceIndex) {
  try {
    const [res] = await db
      .insert(foodPriceIndexesTable)
      .values(data)
      .returning({ id: foodPriceIndexesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createFoodPriceIndexes(datas: InsertFoodPriceIndex[]) {
  try {
    const [res] = await db
      .insert(foodPriceIndexesTable)
      .values(datas)
      .onConflictDoUpdate({
        target: [
          foodPriceIndexesTable.month,
          foodPriceIndexesTable.year,
          foodPriceIndexesTable.countryId,
        ],
        set: {
          open: foodPriceIndexesTable.open,
          low: foodPriceIndexesTable.low,
          high: foodPriceIndexesTable.high,
          close: foodPriceIndexesTable.close,
          date: foodPriceIndexesTable.date,
        },
      })
      .returning({ id: foodPriceIndexesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateFoodPriceIndex(
  id: string,
  data: InsertFoodPriceIndex,
) {
  try {
    const [res] = await db
      .update(foodPriceIndexesTable)
      .set(data)
      .where(eq(foodPriceIndexesTable.id, id))
      .returning({ id: foodPriceIndexesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteFoodPriceIndex(id: string) {
  try {
    const [res] = await db
      .delete(foodPriceIndexesTable)
      .where(eq(foodPriceIndexesTable.id, id))
      .returning({ id: foodPriceIndexesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteFoodPriceIndexes(ids: string[]) {
  try {
    const [res] = await db
      .delete(foodPriceIndexesTable)
      .where(inArray(foodPriceIndexesTable.id, ids))
      .returning({ id: foodPriceIndexesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
