import heroImg from "@/assets/hero.jpg";
import { useLocation, useNavigate } from "react-router-dom";

const Hero = ({ title, subtitle }: { title: string; subtitle: string }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const goToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
  <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <img
      src={heroImg}
      alt="Biblioteca jurídica clássica"
      width={1920}
      height={1080}
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-overlay" />
    <div className="relative container mx-auto px-4 text-center max-w-4xl">
      <div className="text-xs tracking-[0.4em] text-primary uppercase mb-6">Advocacia · Desde sempre ao seu lado</div>
      <h1 className="font-serif text-5xl md:text-7xl text-foreground leading-tight mb-6">
        {title.split(" ").map((w, i) =>
          i === title.split(" ").length - 1 ? (
            <span key={i} className="text-gradient-gold">{w}</span>
          ) : (
            <span key={i}>{w} </span>
          )
        )}
      </h1>
      <div className="gold-divider w-32 mx-auto my-6" />
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="#contato"
          onClick={(e) => goToSection(e, "contato")}
          className="inline-block bg-gradient-gold text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest font-medium shadow-gold hover:opacity-90 transition-smooth"
        >
          Agendar Consulta
        </a>
        <a
          href="#areas"
          onClick={(e) => goToSection(e, "areas")}
          className="inline-block border border-primary text-primary px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-primary hover:text-primary-foreground transition-smooth"
        >
          Áreas de Atuação
        </a>
      </div>
    </div>
  </section>
  );
};

export default Hero;
