import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, updateVideoSchema } from "@shared/schema";

// Admin credentials - stored in memory, can be changed at runtime
let adminEmail = "sofivgonzalez7@gmail.com";
let adminPassword = "Diosteama1995MUCHO!";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ==========================================
  // AUTH - Admin Login
  // ==========================================
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    if (email === adminEmail && password === adminPassword) {
      return res.json({ success: true });
    }
    return res.status(401).json({ message: "Credenciales incorrectas" });
  });

  app.post("/api/admin/change-password", (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }
    adminPassword = newPassword;
    return res.json({ success: true });
  });

  // ==========================================
  // AUTH - Member Register / Login
  // ==========================================
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Nombre, email y contraseña son requeridos" });
    }

    const existing = await storage.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const user = await storage.createUser({ email, password, name });
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      membershipActive: user.membershipActive,
      membershipType: user.membershipType,
    });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son requeridos" });
    }

    const user = await storage.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
    if (user.disabled) {
      return res.status(403).json({ message: "Tu cuenta ha sido desactivada" });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      membershipActive: user.membershipActive,
      membershipType: user.membershipType,
    });
  });

  // ==========================================
  // USERS - Admin management
  // ==========================================
  app.get("/api/admin/users", async (_req, res) => {
    const allUsers = await storage.getAllUsers();
    const safeUsers = allUsers.map((u) => ({
      id: u.id,
      email: u.email,
      disabled: u.disabled,
      membershipActive: u.membershipActive,
      membershipType: u.membershipType,
      createdAt: u.createdAt,
    }));
    return res.json(safeUsers);
  });

  app.patch("/api/admin/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updated = await storage.updateUser(id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json({
      id: updated.id,
      email: updated.email,
      disabled: updated.disabled,
      membershipActive: updated.membershipActive,
      membershipType: updated.membershipType,
    });
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteUser(id);
    return res.json({ success: true });
  });

  // ==========================================
  // VIDEOS - Admin CRUD
  // ==========================================
  app.get("/api/admin/videos", async (_req, res) => {
    const allVideos = await storage.getAllVideos();
    return res.json(allVideos);
  });

  app.post("/api/admin/videos", async (req, res) => {
    const parsed = insertVideoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Datos inválidos", errors: parsed.error.errors });
    }
    const video = await storage.createVideo(parsed.data);
    return res.json(video);
  });

  app.patch("/api/admin/videos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = updateVideoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Datos inválidos", errors: parsed.error.errors });
    }
    const updated = await storage.updateVideo(id, parsed.data);
    if (!updated)
      return res.status(404).json({ message: "Video no encontrado" });
    return res.json(updated);
  });

  app.delete("/api/admin/videos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteVideo(id);
    return res.json({ success: true });
  });

  // ==========================================
  // VIDEOS - Member access (protected)
  // ==========================================
  app.get("/api/videos", async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const user = await storage.getUser(parseInt(userId));
    if (!user || user.disabled) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    if (!user.membershipActive) {
      return res.status(403).json({ message: "Membresía no activa" });
    }

    const vids = await storage.getActiveVideos(user.membershipType || "fenix");
    return res.json(vids);
  });

  // ==========================================
  // SITE SETTINGS
  // ==========================================
  app.get("/api/settings", async (_req, res) => {
    const settings = await storage.getAllSettings();
    const obj: Record<string, string> = {};
    settings.forEach((s) => {
      obj[s.key] = s.value;
    });
    return res.json(obj);
  });

  app.post("/api/admin/settings", async (req, res) => {
    const entries = Object.entries(req.body) as [string, string][];
    for (const [key, value] of entries) {
      await storage.setSetting(key, value);
    }
    return res.json({ success: true });
  });

  return httpServer;
}
