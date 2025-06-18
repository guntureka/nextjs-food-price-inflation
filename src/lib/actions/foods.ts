"use server";

import { db } from "@/db";
import { foodsTable, InsertFood } from "@/db/schema";
import { count, eq, inArray, sql } from "drizzle-orm";

export async function getFoods() {
  try {
    const res = await db.select().from(foodsTable);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getFood(id: string) {
  try {
    const [res] = await db
      .select()
      .from(foodsTable)
      .where(eq(foodsTable.id, id))
      .limit(1);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createFood(data: InsertFood) {
  try {
    const [res] = await db
      .insert(foodsTable)
      .values(data)
      .returning({ id: foodsTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createFoods(datas: InsertFood[]) {
  try {
    const res = await db
      .insert(foodsTable)
      .values(datas)
      .onConflictDoUpdate({
        target: foodsTable.name,
        set: { description: sql`excluded.description` },
      })
      .returning({ id: foodsTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateFood(id: string, data: InsertFood) {
  try {
    const [res] = await db
      .update(foodsTable)
      .set(data)
      .where(eq(foodsTable.id, id))
      .returning({ id: foodsTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteFood(id: string) {
  try {
    const [res] = await db
      .delete(foodsTable)
      .where(eq(foodsTable.id, id))
      .returning({ id: foodsTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteFoods(ids: string[]) {
  try {
    const [res] = await db
      .delete(foodsTable)
      .where(inArray(foodsTable.id, ids))
      .returning({ id: foodsTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function countFoods() {
  try {
    const [res] = await db.select({ count: count() }).from(foodsTable);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
