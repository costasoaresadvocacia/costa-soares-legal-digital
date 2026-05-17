import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";

const Footer = ({ logoUrl }: { logoUrl?: string }) => (
  <footer className="bg-background border-t border-border py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            {logoUrl ? (
              <img src={logoUrl} alt="Costa Soares" width={48} height={48} className="h-12 w-12 object-contain" />
            ) : null}
            <div>
              <div className="font-serif text-xl text-primary">Costa Soares</div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Advogados</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Escritório de advocacia especializado em Direito Cível, Direito do Consumidor, Direito Imobiliário, Sucessões e Assessoria Empresarial.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-lg text-primary mb-4">Contato</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="tel:+5511972466811" className="hover:text-primary transition-smooth">(11) 9-7246-6811</a></li>
            <li><a href="mailto:contato@costasoares.adv.br" className="hover:text-primary transition-smooth">contato@costasoares.adv.br</a></li>
            <li>costasoares.adv.br</li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg text-primary mb-4">Redes Sociais</h4>
          <div className="flex gap-3">
            {[
              { Icon: Instagram, href: "https://instagram.com/" , label: "Instagram"},
              { Icon: Facebook, href: "https://facebook.com/", label: "Facebook" },
              { Icon: Linkedin, href: "https://linkedin.com/", label: "LinkedIn" },
              { Icon: MessageCircle, href: "https://wa.me/5511972466811", label: "WhatsApp" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="h-10 w-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-smooth"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="gold-divider mb-6" />
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-2">
        <p>© {new Date().getFullYear()} Costa Soares Advogados. Todos os direitos reservados.</p>
        <p className="tracking-widest uppercase">OAB · Advocacia Ética e Responsável</p>
      </div>
    </div>
  </footer>
);

export default Footer;
