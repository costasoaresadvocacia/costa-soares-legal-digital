import type { Post } from "@/lib/api";

const Blog = ({ posts }: { posts: Post[] }) => (
  <section id="blog" className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <div className="text-xs tracking-[0.4em] text-primary uppercase mb-4">Publicações</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-4">Artigos & Atualizações</h2>
        <div className="gold-divider w-24 mx-auto" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <a
            key={p.id}
            href={p.url || "#"}
            className="group bg-card border border-border p-8 hover:border-primary transition-smooth flex flex-col"
          >
            <div className="text-xs uppercase tracking-widest text-primary mb-4">
              {new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
            <h3 className="font-serif text-2xl mb-3 group-hover:text-primary transition-smooth">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.excerpt}</p>
            <div className="mt-6 text-xs uppercase tracking-widest text-primary">Ler mais →</div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Blog;
