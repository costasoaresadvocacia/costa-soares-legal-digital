import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#areas", label: "Áreas" },
  { href: "#advogados", label: "Advogados" },
  { href: "#blog", label: "Blog" },
  { href: "#contato", label: "Contato" },
];

const Header = ({ logoUrl }: { logoUrl?: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToSection = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    const id = href.replace("#", "");
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname !== "/") navigate("/");
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-elegant" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Costa Soares Advocacia" width={48} height={48} className="h-12 w-12 object-contain" />
          ) : (
            <div className="h-12 w-12 flex items-center justify-center border border-primary text-primary font-serif text-xl font-bold tracking-wider">
              CS
            </div>
          )}
          <div className={logoUrl ? "hidden sm:block" : ""}>
            <div className="font-serif text-xl text-primary leading-none">Costa Soares</div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Advocacia</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm uppercase tracking-wider text-foreground/80 hover:text-primary transition-smooth"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          aria-label="Menu"
          className="md:hidden text-primary"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-6 h-0.5 bg-primary mb-1.5" />
          <span className="block w-6 h-0.5 bg-primary mb-1.5" />
          <span className="block w-6 h-0.5 bg-primary" />
        </button>
      </div>

      {open && (
        <nav className="md:hidden bg-background/98 border-t border-border">
          <div className="container mx-auto py-4 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-wider text-foreground/80 hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
