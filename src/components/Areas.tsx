import { Scale, ShieldCheck, Scroll, Briefcase } from "lucide-react";

const areas = [
  {
    icon: Scale,
    title: "Direito Cível",
    desc: "Atuação ampla em demandas cíveis, contratos, responsabilidade civil e relações privadas.",
  },
  {
    icon: ShieldCheck,
    title: "Direito do Consumidor",
    desc: "Defesa de consumidores e empresas em litígios, indenizações e práticas abusivas.",
  },
  {
    icon: Scroll,
    title: "Sucessório",
    desc: "Planejamento sucessório, inventários, testamentos e proteção patrimonial familiar.",
  },
  {
    icon: Briefcase,
    title: "Assessoria Empresarial",
    desc: "Consultoria preventiva, contratos empresariais e suporte estratégico para negócios.",
  },
];

const Areas = () => (
  <section id="areas" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <div className="text-xs tracking-[0.4em] text-primary uppercase mb-4">Especialidades</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-4">Áreas de Atuação</h2>
        <div className="gold-divider w-24 mx-auto" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {areas.map((a) => (
          <div
            key={a.title}
            className="group bg-card border border-border p-8 hover:border-primary transition-smooth"
          >
            <a.icon className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-smooth" strokeWidth={1.2} />
            <h3 className="font-serif text-2xl mb-3">{a.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Areas;
