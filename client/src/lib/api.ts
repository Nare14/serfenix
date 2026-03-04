import { apiRequest } from "./queryClient";

// Admin auth
export async function adminLogin(email: string, password: string) {
  const res = await apiRequest("POST", "/api/admin/login", { email, password });
  return res.json();
}

export async function adminChangePassword(newPassword: string) {
  const res = await apiRequest("POST", "/api/admin/change-password", { newPassword });
  return res.json();
}

// Member auth
export async function memberLogin(email: string, password: string) {
  const res = await apiRequest("POST", "/api/auth/login", { email, password });
  return res.json();
}

export async function memberRegister(name: string, email: string, password: string) {
  const res = await apiRequest("POST", "/api/auth/register", { name, email, password });
  return res.json();
}

// Admin - Users
export async function fetchUsers() {
  const res = await fetch("/api/admin/users");
  return res.json();
}

export async function updateUser(id: number, data: any) {
  const res = await apiRequest("PATCH", `/api/admin/users/${id}`, data);
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await apiRequest("DELETE", `/api/admin/users/${id}`);
  return res.json();
}

// Admin - Videos
export async function fetchAdminVideos() {
  const res = await fetch("/api/admin/videos");
  return res.json();
}

export async function createVideo(data: any) {
  const res = await apiRequest("POST", "/api/admin/videos", data);
  return res.json();
}

export async function updateVideo(id: number, data: any) {
  const res = await apiRequest("PATCH", `/api/admin/videos/${id}`, data);
  return res.json();
}

export async function deleteVideo(id: number) {
  const res = await apiRequest("DELETE", `/api/admin/videos/${id}`);
  return res.json();
}

// Member - Videos
export async function fetchMemberVideos(userId: number) {
  const res = await fetch(`/api/videos?userId=${userId}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

// Settings
export async function fetchSettings() {
  const res = await fetch("/api/settings");
  return res.json();
}

export async function saveSettings(data: Record<string, string>) {
  const res = await apiRequest("POST", "/api/admin/settings", data);
  return res.json();
}
