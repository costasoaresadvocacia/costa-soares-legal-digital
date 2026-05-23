// API client for ASP Classic backend
// Base URL — substitua pelo endpoint real do servidor ASP Clássico
export const API_BASE_URL = "../api/";

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  lawyers: Lawyer[];
  logoUrl?: string;
}

export interface Lawyer {
  id: number;
  name: string;
  title: string;
  oab: string;
  bio: string;
  photoUrl: string;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
  url?: string;
  content?: string; // HTML do corpo do artigo
}

// Fallback content used when API is unreachable (developer-friendly default)
const fallbackContent: SiteContent = {
  heroTitle: "Costa Soares Advocacia",
  heroSubtitle:
    "Excelência em Direito Cível, Consumidor, Sucessório, Imobiliário e Assessoria Empresarial.",
  aboutTitle: "Tradição, ética e resultado",
  aboutText:
    "O escritório Costa Soares Advocacia atua de forma personalizada e estratégica, com atendimento próximo ao cliente e profundo conhecimento técnico. Nossa missão é proteger direitos, prevenir litígios e construir soluções jurídicas sob medida para pessoas e empresas.",
  lawyers: [
    {
      id: 1,
      name: "Dr. Alessandro Vieira Costa",
      title: "Advogado",
      oab: "OAB/SP 354.000",
      bio: "Especialista em Direito do Consumidor e Assessoria Empresarial, dedicado à defesa estratégica de clientes corporativos e individuais.",
      photoUrl: "../arquivos/alessandrovieiracosta.png",
    },
    {
      id: 2,
      name: "Dra. Luciana Soares Silveira",
      title: "Advogada",
      oab: "OAB/SP 198.510",
      bio: "Especialista em Direito Cível e Sucessório, com vasta experiência em causas complexas e planejamento patrimonial.",
      photoUrl: "../arquivos/lucianasoaressilveira.png",
    },
  ],
  logoUrl: "../arquivos/logo.png",
};

const fallbackPosts: Post[] = [
  {
    id: 1,
    title: "Novas regras do Código de Defesa do Consumidor",
    excerpt: "Entenda as recentes mudanças e como elas impactam suas relações de consumo.",
    date: "2026-04-12",
  },
  {
    id: 2,
    title: "Planejamento Sucessório: por que começar agora",
    excerpt: "Proteja seu patrimônio e sua família com estratégias jurídicas eficazes.",
    date: "2026-03-28",
  },
  {
    id: 3,
    title: "Assessoria Empresarial preventiva",
    excerpt: "Como evitar litígios e garantir segurança jurídica para o seu negócio.",
    date: "2026-02-15",
  },
];

export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch(`${API_BASE_URL}/content.asp`);
    if (!res.ok) throw new Error("API indisponível");
    return await res.json();
  } catch {
    return fallbackContent;
  }
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/posts.asp`);
    if (!res.ok) throw new Error("API indisponível");
    return await res.json();
  } catch {
    return fallbackPosts;
  }
}

export async function fetchPost(id: number | string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/posts.asp?id=${id}`);
    if (!res.ok) throw new Error("API indisponível");
    return await res.json();
  } catch {
    const fb = fallbackPosts.find((p) => String(p.id) === String(id));
    return fb ? { ...fb, content: `<p>${fb.excerpt}</p>` } : null;
  }
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendContact(payload: ContactPayload): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/contact.asp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
