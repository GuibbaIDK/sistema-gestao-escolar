import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, Search, LogOut } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function TurmasPublic() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const { logout } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setLocation("/");
    },
  });

  const { data: turmasData, isLoading } = trpc.turmas.list.useQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const handleViewTurma = (turmaId: number) => {
    setLocation(`/turmas/${turmaId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
              <div className="w-4 h-4 border border-white"></div>
            </div>
            <span className="text-technical-lg">TURMAS</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/")}
            >
              Voltar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl mb-6 text-technical-lg">Listagem de Turmas</h1>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome da turma..."
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Turmas Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Carregando turmas...</p>
          </div>
        ) : turmasData && turmasData.items.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {turmasData.items.map((turma: any) => (
                <Card key={turma.id} className="tech-box border-border bg-card/50">
                  <div className="p-6">
                    <h3 className="text-technical-sm mb-2">{turma.nome}</h3>
                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      <p>
                        <span className="text-foreground font-semibold">Ano:</span> {turma.ano}
                      </p>
                      <p>
                        <span className="text-foreground font-semibold">Turno:</span> {turma.turno}
                      </p>
                      {turma.descricao && (
                        <p>
                          <span className="text-foreground font-semibold">Descrição:</span>{" "}
                          {turma.descricao}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-accent hover:bg-accent/90"
                      onClick={() => handleViewTurma(turma.id)}
                    >
                      Ver Alunos
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {turmasData.pages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {page} de {turmasData.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === turmasData.pages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Nenhuma turma encontrada.</p>
          </div>
        )}
      </main>
    </div>
  );
}
