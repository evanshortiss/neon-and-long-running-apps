import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const Elements = pgTable("elements", {
  name: text("name").notNull(),
  symbol: varchar("symbol", { length: 3 }).notNull(),
  atomicNumber: integer("atomic_number").notNull().primaryKey(),
});

export type Element = typeof Elements.$inferSelect;
