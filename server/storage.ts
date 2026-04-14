import { eq, asc, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  videos,
  siteSettings,
  type User,
  type InsertUser,
  type Video,
  type InsertVideo,
  type UpdateVideo,
  type SiteSetting,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<void>;

  // Videos
  getVideo(id: number): Promise<Video | undefined>;
  getAllVideos(): Promise<Video[]>;
  getActiveVideos(membershipType?: string): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, data: UpdateVideo): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<void>;

  // Site Settings
  getSetting(key: string): Promise<string | undefined>;
  setSetting(key: string, value: string): Promise<void>;
  getAllSettings(): Promise<SiteSetting[]>;
}

export class DatabaseStorage implements IStorage {
  // ---- Users ----
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // ---- Videos ----
  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async getAllVideos(): Promise<Video[]> {
    return db
      .select()
      .from(videos)
      .orderBy(asc(videos.sortOrder), desc(videos.createdAt));
  }

  async getActiveVideos(membershipType?: string): Promise<Video[]> {
    const allActive = await db
      .select()
      .from(videos)
      .where(eq(videos.active, true))
      .orderBy(asc(videos.sortOrder), desc(videos.createdAt));

    if (membershipType !== "fenix_pro") {
      return [];
    }

    return allActive.filter(
      (v) =>
        v.membershipRequired === "fenix_pro" ||
        v.membershipRequired === "all" ||
        v.membershipRequired === "fenix"
    );
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [created] = await db.insert(videos).values(video).returning();
    return created;
  }

  async updateVideo(id: number, data: UpdateVideo): Promise<Video | undefined> {
    const [updated] = await db
      .update(videos)
      .set(data)
      .where(eq(videos.id, id))
      .returning();
    return updated;
  }

  async deleteVideo(id: number): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  // ---- Site Settings ----
  async getSetting(key: string): Promise<string | undefined> {
    const [setting] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key));
    return setting?.value;
  }

  async setSetting(key: string, value: string): Promise<void> {
    await db.insert(siteSettings).values({ key, value }).onConflictDoUpdate({
      target: siteSettings.key,
      set: { value },
    });
  }

  async getAllSettings(): Promise<SiteSetting[]> {
    return db.select().from(siteSettings);
  }
}

export const storage = new DatabaseStorage();
