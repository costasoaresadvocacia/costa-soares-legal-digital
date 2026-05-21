// Admin API client for ASP Classic backend
import { API_BASE_URL, type Lawyer, type Post, type SiteContent } from "./api";

const TOKEN_KEY = "cs_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${API_BASE_URL}${path}`, { ...init, headers });
}

export interface LoginResult {
  ok: boolean;
  token?: string;
  message?: string;
}

export async function login(username: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/login.asp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return { ok: false, message: "Credenciais inválidas" };
    const data = await res.json();
    if (data?.token) {
      setToken(data.token);
      return { ok: true, token: data.token };
    }
    return { ok: false, message: data?.message || "Falha no login" };
  } catch {
    return { ok: false, message: "Servidor indisponível" };
  }
}

export async function logout(): Promise<void> {
  try {
    await authFetch("/admin/logout.asp", { method: "POST" });
  } catch {
    // ignore
  } finally {
    clearToken();
  }
}

// ============ Site content ============
export async function adminGetContent(): Promise<SiteContent | null> {
  try {
    const res = await authFetch("/admin/content.asp");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function adminSaveContent(content: Partial<SiteContent>): Promise<boolean> {
  try {
    const res = await authFetch("/admin/content.asp", {
      method: "POST",
      body: JSON.stringify(content),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ============ Lawyers ============
export async function adminSaveLawyer(lawyer: Partial<Lawyer>): Promise<Lawyer | null> {
  try {
    const res = await authFetch("/admin/lawyers.asp", {
      method: "POST",
      body: JSON.stringify(lawyer),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function adminDeleteLawyer(id: number): Promise<boolean> {
  try {
    const res = await authFetch(`/admin/lawyers.asp?id=${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

// ============ Posts ============
export async function adminGetPosts(): Promise<Post[]> {
  try {
    const res = await authFetch("/admin/posts.asp");
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function adminGetPost(id: number): Promise<Post | null> {
  try {
    const res = await authFetch(`/admin/posts.asp?id=${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export interface PostInput {
  id?: number;
  title: string;
  excerpt: string;
  content: string; // HTML
  date: string;
  imageUrl?: string;
  url?: string;
}

export async function adminSavePost(post: PostInput): Promise<Post | null> {
  try {
    const res = await authFetch("/admin/posts.asp", {
      method: "POST",
      body: JSON.stringify(post),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function adminDeletePost(id: number): Promise<boolean> {
  try {
    const res = await authFetch(`/admin/posts.asp?id=${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

// ============ Upload ============
export async function adminUploadImage(file: File): Promise<string | null> {
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await authFetch("/admin/upload.asp", { method: "POST", body: fd });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.url || null;
  } catch {
    return null;
  }
}
