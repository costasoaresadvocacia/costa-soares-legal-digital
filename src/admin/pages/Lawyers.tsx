import { useEffect, useState } from "react";
import { adminDeleteLawyer, adminGetContent, adminSaveLawyer, adminUploadImage } from "@/lib/adminApi";
import { fetchSiteContent, type Lawyer } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

const empty: Lawyer = { id: 0, name: "", title: "", oab: "", bio: "", photoUrl: "" };

const LawyersPage = () => {
  const [list, setList] = useState<Lawyer[]>([]);
  const [editing, setEditing] = useState<Lawyer | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    const c = (await adminGetContent()) || (await fetchSiteContent());
    setList(c.lawyers || []);
  };

  useEffect(() => {
    reload();
  }, []);

  const startEdit = (l?: Lawyer) => {
    setEditing(l ? { ...l } : { ...empty });
    setOpen(true);
  };

  const onSave = async () => {
    if (!editing) return;
    setSaving(true);
    const r = await adminSaveLawyer(editing);
    setSaving(false);
    if (r) {
      toast({ title: "Advogado salvo" });
      setOpen(false);
      reload();
    } else {
      toast({ title: "Falha ao salvar", variant: "destructive" });
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Excluir este advogado?")) return;
    if (await adminDeleteLawyer(id)) {
      toast({ title: "Excluído" });
      reload();
    } else toast({ title: "Falha ao excluir", variant: "destructive" });
  };

  const onPhoto = async (file: File) => {
    if (!editing) return;
    const url = await adminUploadImage(file);
    if (url) setEditing({ ...editing, photoUrl: url });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-2">Advogados</h1>
          <p className="text-muted-foreground text-sm">Gerencie os perfis exibidos no site.</p>
        </div>
        <Button onClick={() => startEdit()}>
          <Plus className="w-4 h-4 mr-2" /> Novo
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {list.map((l) => (
          <div key={l.id} className="border border-border p-4 flex gap-4 bg-card">
            {l.photoUrl && (
              <img src={l.photoUrl} alt={l.name} className="w-20 h-20 object-cover border border-border" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-serif text-lg truncate">{l.name}</div>
              <div className="text-xs text-primary uppercase tracking-widest">{l.title}</div>
              <div className="text-xs text-muted-foreground">{l.oab}</div>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="icon" variant="ghost" onClick={() => startEdit(l)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(l.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar advogado" : "Novo advogado"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>OAB</Label>
                <Input value={editing.oab} onChange={(e) => setEditing({ ...editing, oab: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea rows={4} value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Foto</Label>
                <div className="flex items-center gap-3">
                  {editing.photoUrl && (
                    <img src={editing.photoUrl} alt="" className="w-16 h-16 object-cover border border-border" />
                  )}
                  <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onPhoto(e.target.files[0])} />
                </div>
              </div>
              <Button onClick={onSave} disabled={saving} className="w-full">
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LawyersPage;
