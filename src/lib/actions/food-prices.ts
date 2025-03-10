"use server";

import { db } from "@/db";
import { foodPricesTable, InsertFoodPrice } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function getFoodPrices() {
  try {
    const res = await db.select().from(foodPricesTable);

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
