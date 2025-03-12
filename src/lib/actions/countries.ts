"use server";

import { db } from "@/db";
import { countriesTable, InsertCountry } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCountries() {
  try {
    const res = await db.select().from(countriesTable);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

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
