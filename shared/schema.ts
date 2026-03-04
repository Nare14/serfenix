import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - members who register on the site
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  password: text("password").notNull(),
  disabled: boolean("disabled").notNull().default(false),
  membershipActive: boolean("membership_active").notNull().default(false),
  membershipType: text("membership_type"), // "fenix" | "fenix_pro"
  createdAt: timestamp("created_at").defaultNow(),
});

// Videos table - exclusive content managed by admin
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(), // YouTube/Vimeo embed URL
  category: text("category").notNull().default("general"), // module/category
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  membershipRequired: text("membership_required").notNull().default("fenix"), // "fenix" | "fenix_pro"
  createdAt: timestamp("created_at").defaultNow(),
});

// Site settings table - key/value pairs for site configuration
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  password: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const updateVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
}).partial();

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type UpdateVideo = z.infer<typeof updateVideoSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
