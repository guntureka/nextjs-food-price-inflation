import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  json,
  pgTable,
  real,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Tables

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  phoneNumber: varchar("phone_number", { length: 15 }),
  image: text("image"),
  role: text("role").default("guest"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const session = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const verification = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const countriesTable = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  countryCode: varchar("country_code", { length: 3 }).unique().notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  // geojsonUrl: text("geojson_url"),
  geojson: json("geojson"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const foodsTable = pgTable("foods", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const foodPricesTable = pgTable(
  "food_prices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    open: real("open"),
    low: real("low"),
    high: real("high"),
    close: real("close"),
    date: date("date", { mode: "date" }).notNull(),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    foodId: uuid("food_id")
      .references(() => foodsTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    countryId: uuid("country_id")
      .references(() => countriesTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    unique("year_month_food_country").on(
      t.year,
      t.month,
      t.foodId,
      t.countryId,
    ),
  ],
);

// Relations

export const countryRelations = relations(countriesTable, ({ many }) => ({
  foodPrices: many(foodPricesTable),
  // foodPriceIndexes: many(foodPriceIndexesTable),
}));

export const foodRelations = relations(foodsTable, ({ many }) => ({
  foodPrices: many(foodPricesTable),
}));

export const foodPriceRelations = relations(foodPricesTable, ({ one }) => ({
  food: one(foodsTable, {
    fields: [foodPricesTable.foodId],
    references: [foodsTable.id],
  }),
  country: one(countriesTable, {
    fields: [foodPricesTable.countryId],
    references: [countriesTable.id],
  }),
}));

// Types

export type InsertCountry = typeof countriesTable.$inferInsert;
export type SelectCountry = typeof countriesTable.$inferSelect;

export type InsertFood = typeof foodsTable.$inferInsert;
export type SelectFood = typeof foodsTable.$inferSelect;

export type InsertFoodPrice = typeof foodPricesTable.$inferInsert;
export type SelectFoodPrice = typeof foodPricesTable.$inferSelect;
