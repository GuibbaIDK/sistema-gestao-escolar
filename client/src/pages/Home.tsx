import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Usar useEffect para redirecionar após render, não durante render
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === "admin") {
        setLocation("/admin/turmas");
      } else {
        setLocation("/turmas");
      }
    }
  }, [isAuthenticated, user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  // Se autenticado, redireciona para dashboard (useEffect já cuidará disso)
  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm">
          <div className="container flex items-center justify-between h-20 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                GESTÃO ESCOLAR
              </span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-32 md:py-48 px-4">
          <div className="container max-w-4xl mx-auto text-center">
            <div className="mb-8 inline-block">
              <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-full">
                <p className="text-sm font-semibold text-cyan-300">✨ Bem-vindo ao Sistema</p>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Sistema de Gestão Escolar
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
              Plataforma moderna e intuitiva para gerenciar turmas, alunos e usuários com segurança e eficiência.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setLocation("/login")}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Fazer Login
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => setLocation("/register")}
                size="lg"
                variant="outline"
                className="border-2 border-purple-400 text-purple-300 hover:bg-purple-500/20 font-semibold px-8 py-6 text-lg rounded-lg transition-all"
              >
                Criar Conta
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="mt-20 grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="font-semibold text-lg mb-2">Gestão de Turmas</h3>
                <p className="text-gray-400 text-sm">Organize e gerencie suas turmas facilmente</p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="font-semibold text-lg mb-2">Controle de Alunos</h3>
                <p className="text-gray-400 text-sm">Registre e acompanhe seus alunos</p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <div className="text-3xl mb-3">🔐</div>
                <h3 className="font-semibold text-lg mb-2">Segurança Total</h3>
                <p className="text-gray-400 text-sm">Acesso protegido com autenticação segura</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4 backdrop-blur-sm">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-400">Sistema de Gestão Escolar</span>
              </div>
              <p className="text-sm text-gray-400">
                © 2024 - Plataforma Moderna e Profissional
              </p>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
