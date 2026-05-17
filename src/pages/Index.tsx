import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Areas from "@/components/Areas";
import Lawyers from "@/components/Lawyers";
import Blog from "@/components/Blog";
import MapSection from "@/components/MapSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { fetchPosts, fetchSiteContent, type Post, type SiteContent } from "@/lib/api";

const Index = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchSiteContent().then(setContent);
    fetchPosts().then(setPosts);
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary text-sm uppercase tracking-widest">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header logoUrl={content.logoUrl} />
      <main>
        <Hero title={content.heroTitle} subtitle={content.heroSubtitle} />
        <About title={content.aboutTitle} text={content.aboutText} />
        <Areas />
        <Lawyers lawyers={content.lawyers} />
        <Blog posts={posts} />
        <Contact />
        <MapSection />
      </main>
      <Footer logoUrl={content.logoUrl} />
    </div>
  );
};

export default Index;
