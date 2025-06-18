"use server";

import { db } from "@/db";
import { InsertUser, users } from "@/db/schema";
import { count, eq, inArray, sql } from "drizzle-orm";

export async function getUsers() {
  try {
    const res = await db.select().from(users);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUser(id: string) {
  try {
    const [res] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(data: InsertUser) {
  try {
    const [res] = await db
      .insert(users)
      .values(data)
      .returning({ id: users.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUsers(datas: InsertUser[]) {
  try {
    const res = await db
      .insert(users)
      .values(datas)
      .onConflictDoUpdate({
        target: users.name,
        set: { name: sql`excluded.name` },
      })
      .returning({ id: users.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(id: string, data: InsertUser) {
  try {
    const [res] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    const [res] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUsers(ids: string[]) {
  try {
    const [res] = await db
      .delete(users)
      .where(inArray(users.id, ids))
      .returning({ id: users.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function countUsers() {
  try {
    const [res] = await db.select({ count: count() }).from(users);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
