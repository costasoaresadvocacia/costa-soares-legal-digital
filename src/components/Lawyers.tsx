import type { Lawyer } from "@/lib/api";
import { User } from "lucide-react";

const Lawyers = ({ lawyers }: { lawyers: Lawyer[] }) => (
  <section id="advogados" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <div className="text-xs tracking-[0.4em] text-primary uppercase mb-4">Equipe</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-4">Nossos Advogados</h2>
        <div className="gold-divider w-24 mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {lawyers.map((l) => (
          <article key={l.id} className="bg-card border border-border overflow-hidden group">
            <div className="aspect-[4/5] bg-muted flex items-center justify-center overflow-hidden">
              {l.photoUrl ? (
                <img
                  src={l.photoUrl}
                  alt={`Foto de ${l.name}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                />
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <User className="h-20 w-20 mx-auto mb-4 text-primary/50" strokeWidth={1} />
                  <div className="text-xs uppercase tracking-widest">Foto via API</div>
                </div>
              )}
            </div>
            <div className="p-8">
              <h3 className="font-serif text-3xl text-primary mb-1">{l.name}</h3>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{l.title}</div>
              <div className="text-xs text-primary/80 mb-4">{l.oab}</div>
              <div className="gold-divider w-12 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed">{l.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Lawyers;
