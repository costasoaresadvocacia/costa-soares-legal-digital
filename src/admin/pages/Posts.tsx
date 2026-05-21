import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminDeletePost, adminGetPosts } from "@/lib/adminApi";
import type { Post } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

const PostsPage = () => {
  const [list, setList] = useState<Post[]>([]);

  const reload = () => adminGetPosts().then(setList);
  useEffect(() => {
    reload();
  }, []);

  const onDelete = async (id: number) => {
    if (!confirm("Excluir este artigo?")) return;
    if (await adminDeletePost(id)) {
      toast({ title: "Artigo excluído" });
      reload();
    } else toast({ title: "Falha ao excluir", variant: "destructive" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-2">Blog</h1>
          <p className="text-muted-foreground text-sm">Gerencie matérias e publicações.</p>
        </div>
        <Button asChild>
          <Link to="/admin/posts/new">
            <Plus className="w-4 h-4 mr-2" /> Nova matéria
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {list.length === 0 && (
          <div className="text-muted-foreground text-sm">Nenhum artigo cadastrado.</div>
        )}
        {list.map((p) => (
          <div key={p.id} className="border border-border p-4 bg-card flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-serif text-lg truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(p.date).toLocaleDateString("pt-BR")}
              </div>
              <div className="text-sm text-muted-foreground truncate">{p.excerpt}</div>
            </div>
            <Button asChild size="icon" variant="ghost">
              <Link to={`/admin/posts/${p.id}`}>
                <Pencil className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(p.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
