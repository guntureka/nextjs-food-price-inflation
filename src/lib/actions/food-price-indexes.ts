"use server";

import { db } from "@/db";
import { foodPriceIndexesTable, InsertFoodPriceIndex } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function getFoodPriceIndexes() {
  try {
    const res = await db.select().from(foodPriceIndexesTable);

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
