import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Facebook, Linkedin, Link2, MessageCircle, Twitter, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchPost, fetchSiteContent, type Post, type SiteContent } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const SITE_URL = "https://costasoares.adv.br";

const Article = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteContent().then(setContent);
    if (!id) return;
    fetchPost(id).then((p) => {
      setPost(p);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (post) document.title = `${post.title} — Costa Soares Advocacia`;
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary text-sm uppercase tracking-widest">Carregando...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header logoUrl={content?.logoUrl} />
        <main className="container mx-auto px-4 pt-32 pb-24 text-center">
          <h1 className="font-serif text-3xl mb-4">Artigo não encontrado</h1>
          <Link to="/" className="text-primary text-sm uppercase tracking-widest">← Voltar ao início</Link>
        </main>
        <Footer logoUrl={content?.logoUrl} />
      </div>
    );
  }

  const pageUrl = `${SITE_URL}/#/artigo/${post.id}`;
  const shareTitle = post.title;
  const shareSummary =
    `${post.excerpt}\n\nPara saber mais, acesse ${SITE_URL} e fique por dentro das principais novidades do mundo jurídico.\n${SITE_URL}`;
  const shareImage = post.imageUrl ? encodeURIComponent(post.imageUrl) : "";

  const shares = [
    {
      label: "WhatsApp",
      Icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${pageUrl}\n\n${shareSummary}`)}`,
    },
    {
      label: "Facebook",
      Icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareSummary)}${shareImage ? `&picture=${shareImage}` : ""}`,
    },
    {
      label: "X / Twitter",
      Icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(`${shareTitle} — ${shareSummary}`)}`,
    },
    {
      label: "LinkedIn",
      Icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareTitle}\n${pageUrl}\n\n${shareSummary}`);
      toast({ title: "Link copiado para a área de transferência" });
    } catch {
      toast({ title: "Não foi possível copiar", variant: "destructive" });
    }
  };

  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <Header logoUrl={content?.logoUrl} />
      <main className="pt-28 pb-24">
        <article className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary mb-8 hover:opacity-80"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar
          </Link>

          <div className="text-xs uppercase tracking-widest text-primary mb-4">{formattedDate}</div>
          <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">{post.title}</h1>
          {post.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 italic">
              {post.excerpt}
            </p>
          )}
          <div className="gold-divider w-24 mb-10" />

          {post.imageUrl && (
            <figure className="mb-10">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-auto object-cover border border-border"
              />
            </figure>
          )}

          {post.content ? (
            <div
              className="prose-article max-w-none text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-muted-foreground">{post.excerpt}</p>
          )}

          <div className="mt-16 pt-8 border-t border-border">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Compartilhe este artigo</div>
            <div className="flex flex-wrap gap-3">
              {shares.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Compartilhar no ${label}`}
                  className="h-11 w-11 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-smooth"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
              <button
                type="button"
                onClick={copyLink}
                aria-label="Copiar link"
                className="h-11 w-11 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-smooth"
              >
                <Link2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4 max-w-xl">
              Ao compartilhar, levamos junto a imagem do artigo, o texto e o convite:
              <em> "Para saber mais, acesse costasoares.adv.br e fique por dentro das principais novidades do mundo jurídico."</em>
            </p>
          </div>
        </article>
      </main>
      <Footer logoUrl={content?.logoUrl} />
    </div>
  );
};

export default Article;
