import { useEffect, useState, FormEvent } from "react";
import { adminGetContent, adminSaveContent, adminUploadImage } from "@/lib/adminApi";
import { fetchSiteContent, type SiteContent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const SiteContentPage = () => {
  const [data, setData] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const c = (await adminGetContent()) || (await fetchSiteContent());
      setData(c);
    })();
  }, []);

  const update = (k: keyof SiteContent, v: string) => {
    if (!data) return;
    setData({ ...data, [k]: v });
  };

  const onLogoUpload = async (file: File) => {
    const url = await adminUploadImage(file);
    if (url) update("logoUrl", url);
    else toast({ title: "Falha no upload do logo", variant: "destructive" });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    const ok = await adminSaveContent({
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      aboutTitle: data.aboutTitle,
      aboutText: data.aboutText,
      logoUrl: data.logoUrl,
    });
    setSaving(false);
    toast({
      title: ok ? "Conteúdo salvo" : "Falha ao salvar",
      variant: ok ? "default" : "destructive",
    });
  };

  if (!data) return <div className="text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Conteúdo do Site</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Edite os textos principais exibidos no site.
      </p>
      <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label>Logo</Label>
          <div className="flex items-center gap-4">
            {data.logoUrl && (
              <img src={data.logoUrl} alt="logo" className="w-16 h-16 object-contain border border-border" />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onLogoUpload(e.target.files[0])}
            />
          </div>
          <Input
            value={data.logoUrl || ""}
            onChange={(e) => update("logoUrl", e.target.value)}
            placeholder="URL do logo"
          />
        </div>
        <div className="space-y-2">
          <Label>Título do Hero</Label>
          <Input value={data.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Subtítulo do Hero</Label>
          <Textarea
            rows={3}
            value={data.heroSubtitle}
            onChange={(e) => update("heroSubtitle", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Título Sobre</Label>
          <Input value={data.aboutTitle} onChange={(e) => update("aboutTitle", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Texto Sobre</Label>
          <Textarea
            rows={6}
            value={data.aboutText}
            onChange={(e) => update("aboutText", e.target.value)}
          />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
};

export default SiteContentPage;
