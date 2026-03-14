import { apiRequest } from "./queryClient";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://estasalebien-production.up.railway.app";

function buildUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE}${path}`;
}

// Admin auth
export async function adminLogin(email: string, password: string) {
  const res = await apiRequest("POST", "/api/admin/login", { email, password });
  return res.json();
}

export async function adminChangePassword(newPassword: string) {
  const res = await apiRequest("POST", "/api/admin/change-password", {
    newPassword,
  });
  return res.json();
}

// Member auth
export async function memberLogin(email: string, password: string) {
  const res = await apiRequest("POST", "/api/auth/login", {
    email,
    password,
  });
  return await res.json();
}

export async function memberRegister(
  name: string,
  email: string,
  password: string
) {
  const res = await apiRequest("POST", "/api/auth/register", {
    name,
    email,
    password,
  });
  return await res.json();
}

// Admin - Users
export async function fetchUsers() {
  const res = await fetch(buildUrl("/api/admin/users"), {
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `No se pudieron cargar los usuarios: ${res.status} ${text}`
    );
  }

  return await res.json();
}

export async function updateUser(id: number, data: any) {
  const res = await apiRequest("PATCH", `/api/admin/users/${id}`, data);
  return await res.json();
}

export async function deleteUser(id: number) {
  const res = await apiRequest("DELETE", `/api/admin/users/${id}`);
  return await res.json();
}

// Admin - Videos
export async function fetchAdminVideos() {
  const res = await fetch(buildUrl("/api/admin/videos"), {
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`No se pudieron cargar los videos: ${res.status} ${text}`);
  }

  return await res.json();
}

export async function createVideo(data: any) {
  const res = await apiRequest("POST", "/api/admin/videos", data);
  return await res.json();
}

export async function updateVideo(id: number, data: any) {
  const res = await apiRequest("PATCH", `/api/admin/videos/${id}`, data);
  return await res.json();
}

export async function deleteVideo(id: number) {
  const res = await apiRequest("DELETE", `/api/admin/videos/${id}`);
  return await res.json();
}

// Member - Videos
export async function fetchMemberVideos() {
  const res = await fetch(buildUrl("/api/videos"), {
    credentials: "include",
  });

  if (!res.ok) {
    let message = "No se pudo cargar el contenido";
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      const text = await res.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  return await res.json();
}

// Settings
export async function fetchSettings() {
  const res = await fetch(buildUrl("/api/settings"), {
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `No se pudo cargar la configuración: ${res.status} ${text}`
    );
  }

  return await res.json();
}

export async function saveSettings(data: Record<string, string>) {
  const res = await apiRequest("POST", "/api/admin/settings", data);
  return await res.json();
}
