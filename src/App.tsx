import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Article from "./pages/Article.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AuthProvider } from "./admin/AuthContext";
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import SiteContentPage from "./admin/pages/SiteContent";
import LawyersPage from "./admin/pages/Lawyers";
import PostsPage from "./admin/pages/Posts";
import PostEditor from "./admin/pages/PostEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="site" element={<SiteContentPage />} />
                <Route path="lawyers" element={<LawyersPage />} />
                <Route path="posts" element={<PostsPage />} />
                <Route path="posts/new" element={<PostEditor />} />
                <Route path="posts/:id" element={<PostEditor />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>

);

export default App;
