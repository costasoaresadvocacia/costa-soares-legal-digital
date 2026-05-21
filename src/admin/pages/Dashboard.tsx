import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminGetPosts } from "@/lib/adminApi";
import { fetchSiteContent, type SiteContent } from "@/lib/api";
import { FileText, Users, Settings } from "lucide-react";

const Dashboard = () => {
  const [posts, setPosts] = useState(0);
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    adminGetPosts().then((p) => setPosts(p.length));
    fetchSiteContent().then(setContent);
  }, []);

  const cards = [
    { to: "/admin/site", label: "Conteúdo do Site", value: content ? "OK" : "—", icon: Settings },
    { to: "/admin/lawyers", label: "Advogados", value: content?.lawyers.length ?? 0, icon: Users },
    { to: "/admin/posts", label: "Artigos do Blog", value: posts, icon: FileText },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Dashboard</h1>
      <p className="text-muted-foreground text-sm mb-8">Visão geral do conteúdo do site.</p>
      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to}>
            <Card className="hover:border-primary transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {c.label}
                </CardTitle>
                <c.icon className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif text-primary">{c.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
