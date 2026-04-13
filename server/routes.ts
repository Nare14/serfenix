import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pool } from "./db";
import { insertVideoSchema, updateVideoSchema } from "@shared/schema";

// Admin credentials - stored in memory, can be changed at runtime
let adminEmail = "sofivgonzalez7@gmail.com";
let adminPassword = "Diosteama1995MUCHO!";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ==========================================
  // HEALTH / DB TEST
  // ==========================================
  app.get("/api/health", (_req, res) => {
    return res.json({ ok: true });
  });

  app.get("/api/db-test", async (_req, res) => {
    try {
      const result = await pool.query("select 1 as ok");
      return res.json(result.rows);
    } catch (error) {
      console.error("DB TEST ERROR:", error);
      return res.status(500).json({
        message: "Error probando la base de datos",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

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
    try {
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

      const user = await storage.createUser({
        email,
        password,
        name,
      });

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        membershipActive: user.membershipActive,
        membershipType: user.membershipType,
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      return res.status(500).json({
        message: "Error registrando usuario",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
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
        return res
          .status(403)
          .json({ message: "Tu cuenta ha sido desactivada" });
      }

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        membershipActive: user.membershipActive,
        membershipType: user.membershipType,
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      return res.status(500).json({
        message: "Error iniciando sesión",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ==========================================
  // USERS - Admin management
  // ==========================================
  app.get("/api/admin/users", async (_req, res) => {
    try {
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
    } catch (error) {
      console.error("GET USERS ERROR:", error);
      return res.status(500).json({
        message: "Error cargando usuarios",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.patch("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateUser(id, req.body);

      if (!updated) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      return res.json({
        id: updated.id,
        email: updated.email,
        disabled: updated.disabled,
        membershipActive: updated.membershipActive,
        membershipType: updated.membershipType,
      });
    } catch (error) {
      console.error("UPDATE USER ERROR:", error);
      return res.status(500).json({
        message: "Error actualizando usuario",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUser(id);
      return res.json({ success: true });
    } catch (error) {
      console.error("DELETE USER ERROR:", error);
      return res.status(500).json({
        message: "Error eliminando usuario",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ==========================================
  // VIDEOS - Admin CRUD
  // ==========================================
  app.get("/api/admin/videos", async (_req, res) => {
    try {
      const allVideos = await storage.getAllVideos();
      return res.json(allVideos);
    } catch (error) {
      console.error("GET ADMIN VIDEOS ERROR:", error);
      return res.status(500).json({
        message: "Error cargando videos",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/admin/videos", async (req, res) => {
    try {
      const parsed = insertVideoSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(400)
          .json({ message: "Datos inválidos", errors: parsed.error.errors });
      }

      const normalizedData = {
        ...parsed.data,
        membershipRequired: "fenix_pro",
      };

      const video = await storage.createVideo(normalizedData);
      return res.json(video);
    } catch (error) {
      console.error("CREATE VIDEO ERROR:", error);
      return res.status(500).json({
        message: "Error creando video",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.patch("/api/admin/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = updateVideoSchema.safeParse(req.body);

      if (!parsed.success) {
        return res
          .status(400)
          .json({ message: "Datos inválidos", errors: parsed.error.errors });
      }

      const normalizedData = {
        ...parsed.data,
        membershipRequired: "fenix_pro",
      };

      const updated = await storage.updateVideo(id, normalizedData);
      if (!updated) {
        return res.status(404).json({ message: "Video no encontrado" });
      }

      return res.json(updated);
    } catch (error) {
      console.error("UPDATE VIDEO ERROR:", error);
      return res.status(500).json({
        message: "Error actualizando video",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.delete("/api/admin/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteVideo(id);
      return res.json({ success: true });
    } catch (error) {
      console.error("DELETE VIDEO ERROR:", error);
      return res.status(500).json({
        message: "Error eliminando video",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ==========================================
  // VIDEOS - Member access (protected)
  // ==========================================
  app.get("/api/videos", async (req, res) => {
    try {
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

      if (user.membershipType !== "fenix_pro") {
        return res
          .status(403)
          .json({ message: "Esta cuenta no tiene acceso a Fénix 2.0" });
      }

      const vids = await storage.getActiveVideos("fenix_pro");
      return res.json(vids);
    } catch (error) {
      console.error("GET MEMBER VIDEOS ERROR:", error);
      return res.status(500).json({
        message: "Error cargando videos del miembro",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ==========================================
  // SITE SETTINGS
  // ==========================================
  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getAllSettings();
      const obj: Record<string, string> = {};

      settings.forEach((s) => {
        obj[s.key] = s.value;
      });

      return res.json(obj);
    } catch (error) {
      console.error("GET SETTINGS ERROR:", error);
      return res.status(500).json({
        message: "Error cargando configuración",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      const entries = Object.entries(req.body) as [string, string][];

      for (const [key, value] of entries) {
        await storage.setSetting(key, value);
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("SAVE SETTINGS ERROR:", error);
      return res.status(500).json({
        message: "Error guardando configuración",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  app.get("/api/fix-fenix", async (_req, res) => {
    try {
      await pool.query(`
        update users
        set membership_type = 'fenix_pro'
        where membership_type is null
           or membership_type = 'fenix';
  
        update videos
        set membership_required = 'fenix_pro'
        where membership_required in ('fenix', 'all')
           or membership_required is null;
      `);

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  });
  return httpServer;
}
