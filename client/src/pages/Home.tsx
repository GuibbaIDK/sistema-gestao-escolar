import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { ArrowRight, Users, BookOpen, Shield } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Carregando...</div>
      </div>
    );
  }

  // Se autenticado, redireciona para dashboard
  if (isAuthenticated && user) {
    if (user.role === "admin") {
      setLocation("/admin/turmas");
    } else {
      setLocation("/turmas");
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
              <div className="w-4 h-4 border border-white"></div>
            </div>
            <span className="text-technical-lg">GESTÃO ESCOLAR</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-accent transition">
              Funcionalidades
            </a>
            <a href="#about" className="text-sm hover:text-accent transition">
              Sobre
            </a>
            <Button asChild variant="default" size="sm">
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          </nav>
          <div className="md:hidden">
            <Button asChild variant="default" size="sm">
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border py-20 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl mb-6 text-technical-xl">
                Sistema de Gestão Escolar
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Plataforma técnica e profissional para gerenciamento completo de turmas, alunos e usuários. 
                Controle de acesso por perfis com segurança e precisão.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                  <a href={getLoginUrl()}>
                    Começar Agora
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#features">Saiba Mais</a>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="tech-box p-8">
                <div className="space-y-4">
                  <div className="h-3 bg-accent/30 w-full"></div>
                  <div className="h-3 bg-accent/20 w-5/6"></div>
                  <div className="h-3 bg-accent/30 w-4/5"></div>
                  <div className="mt-8 space-y-2">
                    <div className="h-2 bg-accent/20 w-full"></div>
                    <div className="h-2 bg-accent/20 w-full"></div>
                    <div className="h-2 bg-accent/20 w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-b border-border py-20 md:py-32">
        <div className="container">
          <h2 className="text-3xl md:text-4xl mb-16 text-technical-lg">
            Funcionalidades Principais
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="tech-box">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 border-2 border-accent flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-technical-sm">Gestão de Turmas</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Crie, edite e gerencie turmas com informações detalhadas sobre ano, turno e descrição.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="tech-box">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 border-2 border-accent flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-technical-sm">Controle de Alunos</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Registre alunos, vincule-os a turmas e mantenha dados de contato atualizados.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="tech-box">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 border-2 border-accent flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-technical-sm">Controle de Acesso</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Autenticação segura com roles (Visitante/Admin) e proteção de rotas sensíveis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-b border-border py-20 md:py-32">
        <div className="container">
          <h2 className="text-3xl md:text-4xl mb-12 text-technical-lg">
            Sobre o Sistema
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="tech-box">
                <h3 className="text-technical-sm mb-3">Visitantes</h3>
                <p className="text-sm text-muted-foreground">
                  Usuários não autenticados podem visualizar a lista de turmas e alunos em modo leitura, 
                  sem permissão para fazer alterações.
                </p>
              </div>
              <div className="tech-box">
                <h3 className="text-technical-sm mb-3">Administradores</h3>
                <p className="text-sm text-muted-foreground">
                  Admins têm controle total do sistema: criar, editar e deletar turmas e alunos, 
                  além de gerenciar permissões de outros usuários.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="tech-box">
                <h3 className="text-technical-sm mb-3">Segurança</h3>
                <p className="text-sm text-muted-foreground">
                  Autenticação via OAuth com tokens JWT, criptografia de senhas e validação rigorosa 
                  de acesso em todas as rotas.
                </p>
              </div>
              <div className="tech-box">
                <h3 className="text-technical-sm mb-3">Tabelas Avançadas</h3>
                <p className="text-sm text-muted-foreground">
                  Listagens com paginação, busca em tempo real e filtros para facilitar a navegação 
                  e localização de dados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl mb-6 text-technical-lg">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Acesse o sistema com sua conta e explore todas as funcionalidades de gestão escolar.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
            <a href={getLoginUrl()}>
              Fazer Login Agora
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 border-2 border-white flex items-center justify-center">
                <div className="w-3 h-3 border border-white"></div>
              </div>
              <span className="text-sm text-muted-foreground">Sistema de Gestão Escolar</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 - Plataforma Técnica e Profissional
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
