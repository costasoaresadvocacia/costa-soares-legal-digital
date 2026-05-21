import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminGetPost, adminSavePost, adminUploadImage, type PostInput } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "../RichTextEditor";
import { toast } from "@/hooks/use-toast";

const today = () => new Date().toISOString().slice(0, 10);

const PostEditor = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = !id || id === "new";
  const [post, setPost] = useState<PostInput>({
    title: "",
    excerpt: "",
    content: "",
    date: today(),
    imageUrl: "",
    url: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    adminGetPost(Number(id)).then((p) => {
      if (p) {
        setPost({
          id: p.id,
          title: p.title,
          excerpt: p.excerpt,
          content: (p as any).content || "",
          date: p.date?.slice(0, 10) || today(),
          imageUrl: p.imageUrl || "",
          url: p.url || "",
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  const onCover = async (file: File) => {
    const url = await adminUploadImage(file);
    if (url) setPost({ ...post, imageUrl: url });
    else toast({ title: "Falha no upload", variant: "destructive" });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const r = await adminSavePost(post);
    setSaving(false);
    if (r) {
      toast({ title: "Artigo salvo" });
      nav("/admin/posts");
    } else toast({ title: "Falha ao salvar", variant: "destructive" });
  };

  if (loading) return <div className="text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">{isNew ? "Nova matéria" : "Editar matéria"}</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Preencha os campos abaixo. Você pode formatar o texto e inserir imagens.
      </p>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} required maxLength={200} />
          </div>
          <div className="space-y-2">
            <Label>Data</Label>
            <Input type="date" value={post.date} onChange={(e) => setPost({ ...post, date: e.target.value })} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Resumo</Label>
          <Textarea rows={2} maxLength={300} value={post.excerpt} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Imagem de capa</Label>
          <div className="flex items-center gap-3">
            {post.imageUrl && (
              <img src={post.imageUrl} alt="" className="w-24 h-16 object-cover border border-border" />
            )}
            <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onCover(e.target.files[0])} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Conteúdo</Label>
          <RichTextEditor value={post.content} onChange={(v) => setPost({ ...post, content: v })} />
        </div>
        <div className="space-y-2">
          <Label>URL externa (opcional)</Label>
          <Input value={post.url} onChange={(e) => setPost({ ...post, url: e.target.value })} placeholder="https://..." />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => nav("/admin/posts")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;
