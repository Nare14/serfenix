import { apiRequest } from "./queryClient";

// Helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
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
  try {
    const res = await apiRequest("POST", "/api/auth/login", {
      email,
      password,
    });
    return await res.json();
  } catch (_error) {
    const savedUsers = getLocal<any[]>("mockUsers", []);

    const user = savedUsers.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Credenciales incorrectas");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      membershipActive: user.membershipActive ?? false,
      membershipType: user.membershipType ?? null,
    };
  }
}

export async function memberRegister(
  name: string,
  email: string,
  password: string
) {
  try {
    const res = await apiRequest("POST", "/api/auth/register", {
      name,
      email,
      password,
    });
    return await res.json();
  } catch (_error) {
    const savedUsers = getLocal<any[]>("mockUsers", []);

    const existingUser = savedUsers.find((u: any) => u.email === email);
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      membershipActive: false,
      membershipType: null,
      disabled: false,
    };

    savedUsers.push(newUser);
    setLocal("mockUsers", savedUsers);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      membershipActive: newUser.membershipActive,
      membershipType: newUser.membershipType,
    };
  }
}

// Admin - Users
export async function fetchUsers() {
  try {
    const res = await fetch("/api/admin/users");
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return getLocal<any[]>("mockUsers", []);
  }
}

export async function updateUser(id: number, data: any) {
  try {
    const res = await apiRequest("PATCH", `/api/admin/users/${id}`, data);
    return await res.json();
  } catch {
    const users = getLocal<any[]>("mockUsers", []);
    const updatedUsers = users.map((u) =>
      u.id === id ? { ...u, ...data } : u
    );
    setLocal("mockUsers", updatedUsers);
    return updatedUsers.find((u) => u.id === id);
  }
}

export async function deleteUser(id: number) {
  try {
    const res = await apiRequest("DELETE", `/api/admin/users/${id}`);
    return await res.json();
  } catch {
    const users = getLocal<any[]>("mockUsers", []);
    const updatedUsers = users.filter((u) => u.id !== id);
    setLocal("mockUsers", updatedUsers);
    return { success: true };
  }
}

// Admin - Videos
export async function fetchAdminVideos() {
  try {
    const res = await fetch("/api/admin/videos");
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return getLocal<any[]>("mockVideos", []);
  }
}

export async function createVideo(data: any) {
  try {
    const res = await apiRequest("POST", "/api/admin/videos", data);
    return await res.json();
  } catch {
    const videos = getLocal<any[]>("mockVideos", []);
    const newVideo = {
      id: Date.now(),
      title: data.title,
      description: data.description ?? "",
      url: data.url,
      category: data.category ?? "general",
      sortOrder: data.sortOrder ?? 0,
      active: data.active ?? true,
      membershipRequired: data.membershipRequired ?? "fenix",
    };
    videos.push(newVideo);
    setLocal("mockVideos", videos);
    return newVideo;
  }
}

export async function updateVideo(id: number, data: any) {
  try {
    const res = await apiRequest("PATCH", `/api/admin/videos/${id}`, data);
    return await res.json();
  } catch {
    const videos = getLocal<any[]>("mockVideos", []);
    const updatedVideos = videos.map((v) =>
      v.id === id ? { ...v, ...data } : v
    );
    setLocal("mockVideos", updatedVideos);
    return updatedVideos.find((v) => v.id === id);
  }
}

export async function deleteVideo(id: number) {
  try {
    const res = await apiRequest("DELETE", `/api/admin/videos/${id}`);
    return await res.json();
  } catch {
    const videos = getLocal<any[]>("mockVideos", []);
    const updatedVideos = videos.filter((v) => v.id !== id);
    setLocal("mockVideos", updatedVideos);
    return { success: true };
  }
}

// Member - Videos
export async function fetchMemberVideos(userId: number) {
  try {
    const res = await fetch(`/api/videos?userId=${userId}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }
    return await res.json();
  } catch {
    const videos = getLocal<any[]>("mockVideos", []);
    const users = getLocal<any[]>("mockUsers", []);
    const user = users.find((u) => u.id === userId);

    if (!user) throw new Error("No autorizado");
    if (user.disabled) throw new Error("Acceso denegado");
    if (!user.membershipActive) throw new Error("Membresía no activa");

    return videos.filter(
      (v) =>
        v.active &&
        (v.membershipRequired === "fenix"
          ? user.membershipType === "fenix" ||
            user.membershipType === "fenix_pro"
          : user.membershipType === "fenix_pro")
    );
  }
}

// Settings
export async function fetchSettings() {
  try {
    const res = await fetch("/api/settings");
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return getLocal<Record<string, string>>("mockSettings", {});
  }
}

export async function saveSettings(data: Record<string, string>) {
  const res = await fetch("/api/admin/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return res.json();
}
