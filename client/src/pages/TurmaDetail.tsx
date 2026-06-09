import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function TurmaDetail() {
  const [match, params] = useRoute("/turmas/:id");
  const [, setLocation] = useLocation();
  const turmaId = params?.id ? parseInt(params.id) : 0;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: turma, isLoading: turmaLoading } = trpc.turmas.getById.useQuery(
    { id: turmaId },
    { enabled: turmaId > 0 }
  );

  const { data: alunosData, isLoading: alunosLoading } = trpc.alunos.list.useQuery(
    {
      page,
      limit: 10,
      search: search || undefined,
      turmaId,
    },
    { enabled: turmaId > 0 }
  );

  if (!match) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
              <div className="w-4 h-4 border border-white"></div>
            </div>
            <span className="text-technical-lg">DETALHES DA TURMA</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/turmas")}
          >
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {turmaLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Carregando turma...</p>
          </div>
        ) : turma ? (
          <>
            {/* Turma Info */}
            <div className="tech-box mb-12 p-8">
              <h1 className="text-3xl mb-6 text-technical-lg">{turma.nome}</h1>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ano</p>
                  <p className="text-technical-sm">{turma.ano}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Turno</p>
                  <p className="text-technical-sm">{turma.turno}</p>
                </div>
                {turma.descricao && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                    <p className="text-technical-sm">{turma.descricao}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Alunos Section */}
            <div>
              <h2 className="text-2xl mb-6 text-technical-lg">Alunos da Turma</h2>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome do aluno..."
                  className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Alunos Table */}
              {alunosLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Carregando alunos...</p>
                </div>
              ) : alunosData && alunosData.items.length > 0 ? (
                <>
                  <div className="tech-box overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4 text-technical-sm">Nome</th>
                          <th className="text-left p-4 text-technical-sm">Matrícula</th>
                          <th className="text-left p-4 text-technical-sm">Email</th>
                          <th className="text-left p-4 text-technical-sm">Telefone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alunosData.items.map((aluno: any) => (
                          <tr key={aluno.id} className="border-b border-border/50 hover:bg-accent/5">
                            <td className="p-4">{aluno.nome}</td>
                            <td className="p-4 text-muted-foreground">{aluno.matricula}</td>
                            <td className="p-4 text-muted-foreground">{aluno.email || "-"}</td>
                            <td className="p-4 text-muted-foreground">{aluno.telefone || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {alunosData.pages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Página {page} de {alunosData.pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === alunosData.pages}
                        onClick={() => setPage(page + 1)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Nenhum aluno encontrado nesta turma.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Turma não encontrada.</p>
          </div>
        )}
      </main>
    </div>
  );
}
