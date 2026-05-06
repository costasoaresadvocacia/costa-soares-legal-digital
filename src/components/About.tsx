const About = ({ title, text }: { title: string; text: string }) => (
  <section id="sobre" className="py-24">
    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
      <div>
        <div className="text-xs tracking-[0.4em] text-primary uppercase mb-4">O Escritório</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-6">{title}</h2>
        <div className="gold-divider w-24 mb-6" />
        <p className="text-muted-foreground leading-relaxed text-lg font-light">{text}</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {["+20", "500+", "15", "98%"].map((n, i) => (
          <div key={i} className="border border-border p-8 text-center bg-card">
            <div className="font-serif text-4xl text-gradient-gold mb-2">{n}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {["Anos de Experiência", "Casos Resolvidos", "Especialistas", "Clientes Satisfeitos"][i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default About;
