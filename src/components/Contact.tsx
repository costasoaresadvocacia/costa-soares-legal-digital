import { useState, FormEvent } from "react";
import { sendContact } from "@/lib/api";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Preencha nome, e-mail e mensagem.");
      return;
    }
    setLoading(true);
    const ok = await sendContact(form);
    setLoading(false);
    if (ok) {
      toast.success("Mensagem enviada com sucesso. Entraremos em contato.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } else {
      toast.error("Não foi possível enviar agora. Tente novamente em instantes.");
    }
  };

  return (
    <section id="contato" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="text-xs tracking-[0.4em] text-primary uppercase mb-4">Fale Conosco</div>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Agende uma Consulta</h2>
          <div className="gold-divider w-24 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-primary mt-1" strokeWidth={1.5} />
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Telefone</div>
                <a href="tel:+5511972466811" className="text-lg hover:text-primary transition-smooth">
                  (11) 9-7246-6811
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary mt-1" strokeWidth={1.5} />
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">E-mail</div>
                <a href="mailto:contato@costasoares.adv.br" className="text-lg hover:text-primary transition-smooth">
                  contato@costasoares.adv.br
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1" strokeWidth={1.5} />
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Endereço</div>
                <p className="text-lg">Rua Enrico Lippi, 20</p>
                <p className="text-sm text-muted-foreground">Vila Sorocabana, Mairinque/SP — CEP 18121-024</p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 bg-card border border-border p-8">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Nome</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                className="w-full bg-input border border-border px-4 py-3 text-foreground focus:border-primary outline-none transition-smooth"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={150}
                  className="w-full bg-input border border-border px-4 py-3 text-foreground focus:border-primary outline-none transition-smooth"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Telefone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={20}
                  className="w-full bg-input border border-border px-4 py-3 text-foreground focus:border-primary outline-none transition-smooth"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Mensagem</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={2000}
                className="w-full bg-input border border-border px-4 py-3 text-foreground focus:border-primary outline-none transition-smooth resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-gold text-primary-foreground py-4 text-sm uppercase tracking-widest font-medium shadow-gold hover:opacity-90 transition-smooth disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar Mensagem"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
