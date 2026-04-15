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

async function parseError(res: Response, fallbackMessage: string) {
  try {
    const data = await res.json();
    return data?.message || fallbackMessage;
  } catch {
    try {
      const text = await res.text();
      return text || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  }
}

// Admin auth
export async function adminLogin(email: string, password: string) {
  const res = await apiRequest("POST", "/api/admin/login", { email, password });
  return await res.json();
}

export async function adminChangePassword(newPassword: string) {
  const res = await apiRequest("POST", "/api/admin/change-password", {
    newPassword,
  });
  return await res.json();
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
    const message = await parseError(res, "No se pudieron cargar los usuarios");
    throw new Error(message);
  }

  return await res.json();
}

export async function updateUser(id: number, data: unknown) {
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
    const message = await parseError(res, "No se pudieron cargar los videos");
    throw new Error(message);
  }

  return await res.json();
}

export async function createVideo(data: unknown) {
  const res = await apiRequest("POST", "/api/admin/videos", data);
  return await res.json();
}

export async function updateVideo(id: number, data: unknown) {
  const res = await apiRequest("PATCH", `/api/admin/videos/${id}`, data);
  return await res.json();
}

export async function deleteVideo(id: number) {
  const res = await apiRequest("DELETE", `/api/admin/videos/${id}`);
  return await res.json();
}

// Member - Videos
export async function fetchMemberVideos(userId: number) {
  const res = await fetch(buildUrl(`/api/videos?userId=${userId}`), {
    credentials: "include",
  });

  if (!res.ok) {
    const message = await parseError(res, "No se pudo cargar el contenido");
    throw new Error(message);
  }

  return await res.json();
}

// Site Settings
export async function fetchSettings() {
  const res = await fetch(buildUrl("/api/site-settings"), {
    credentials: "include",
  });

  if (!res.ok) {
    const message = await parseError(
      res,
      "No se pudo cargar la configuración del sitio"
    );
    throw new Error(message);
  }

  return await res.json();
}

export async function saveSettings(data: Record<string, string>) {
  const res = await fetch(buildUrl("/api/site-settings"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const message = await parseError(
      res,
      "No se pudo guardar la configuración del sitio"
    );
    throw new Error(message);
  }

  return await res.json();
}
