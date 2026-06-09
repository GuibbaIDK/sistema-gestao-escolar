import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Settings, Plus, Trash2, Edit2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("turmas");

  // Redireciona se não for admin
  if (!isAuthenticated || user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl text-technical-lg">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie turmas, alunos e usuários do sistema
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
            <TabsTrigger value="turmas" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Turmas</span>
            </TabsTrigger>
            <TabsTrigger value="alunos" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Alunos</span>
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="turmas" className="space-y-6">
            <AdminTurmasTab />
          </TabsContent>

          <TabsContent value="alunos" className="space-y-6">
            <AdminAlunosTab />
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-6">
            <AdminUsuariosTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// ============ TURMAS TAB ============

function AdminTurmasTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    ano: "",
    turno: "",
    descricao: "",
  });

  const { data: turmasData, refetch } = trpc.turmas.list.useQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const createMutation = trpc.turmas.create.useMutation({
    onSuccess: () => {
      toast.success("Turma criada com sucesso!");
      setFormData({ nome: "", ano: "", turno: "", descricao: "" });
      setOpenDialog(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const updateMutation = trpc.turmas.update.useMutation({
    onSuccess: () => {
      toast.success("Turma atualizada com sucesso!");
      setFormData({ nome: "", ano: "", turno: "", descricao: "" });
      setEditingId(null);
      setOpenDialog(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteMutation = trpc.turmas.delete.useMutation({
    onSuccess: () => {
      toast.success("Turma deletada com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleSave = () => {
    if (!formData.nome || !formData.ano || !formData.turno) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (turma: any) => {
    setEditingId(turma.id);
    setFormData({
      nome: turma.nome,
      ano: turma.ano,
      turno: turma.turno,
      descricao: turma.descricao || "",
    });
    setOpenDialog(true);
  };

  const handleOpenDialog = () => {
    setEditingId(null);
    setFormData({ nome: "", ano: "", turno: "", descricao: "" });
    setOpenDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar turma..."
            className="pl-10 bg-card border-border"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-technical-sm">
                {editingId ? "Editar Turma" : "Nova Turma"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nome</label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="bg-background border-border"
                  placeholder="Ex: 3º Ano A"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Ano</label>
                <Input
                  value={formData.ano}
                  onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                  className="bg-background border-border"
                  placeholder="Ex: 2024"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Turno</label>
                <Input
                  value={formData.turno}
                  onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                  className="bg-background border-border"
                  placeholder="Ex: Matutino"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Descrição</label>
                <Input
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="bg-background border-border"
                  placeholder="Descrição (opcional)"
                />
              </div>
              <Button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90">
                {editingId ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de Turmas */}
      <div className="tech-box overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-technical-sm">Nome</th>
              <th className="text-left p-4 text-technical-sm">Ano</th>
              <th className="text-left p-4 text-technical-sm">Turno</th>
              <th className="text-left p-4 text-technical-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {turmasData?.items.map((turma: any) => (
              <tr key={turma.id} className="border-b border-border/50 hover:bg-accent/5">
                <td className="p-4">{turma.nome}</td>
                <td className="p-4 text-muted-foreground">{turma.ano}</td>
                <td className="p-4 text-muted-foreground">{turma.turno}</td>
                <td className="p-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(turma)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMutation.mutate({ id: turma.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {turmasData && turmasData.pages > 1 && (
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
    </div>
  );
}

// ============ ALUNOS TAB ============

function AdminAlunosTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    turmaId: 0,
    email: "",
    telefone: "",
  });

  const { data: alunosData, refetch } = trpc.alunos.list.useQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const { data: turmasData } = trpc.turmas.list.useQuery({
    page: 1,
    limit: 100,
  });

  const createMutation = trpc.alunos.create.useMutation({
    onSuccess: () => {
      toast.success("Aluno criado com sucesso!");
      setFormData({ nome: "", matricula: "", turmaId: 0, email: "", telefone: "" });
      setOpenDialog(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const updateMutation = trpc.alunos.update.useMutation({
    onSuccess: () => {
      toast.success("Aluno atualizado com sucesso!");
      setFormData({ nome: "", matricula: "", turmaId: 0, email: "", telefone: "" });
      setEditingId(null);
      setOpenDialog(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteMutation = trpc.alunos.delete.useMutation({
    onSuccess: () => {
      toast.success("Aluno deletado com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleSave = () => {
    if (!formData.nome || !formData.matricula || !formData.turmaId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (aluno: any) => {
    setEditingId(aluno.id);
    setFormData({
      nome: aluno.nome,
      matricula: aluno.matricula,
      turmaId: aluno.turmaId,
      email: aluno.email || "",
      telefone: aluno.telefone || "",
    });
    setOpenDialog(true);
  };

  const handleOpenDialog = () => {
    setEditingId(null);
    setFormData({ nome: "", matricula: "", turmaId: 0, email: "", telefone: "" });
    setOpenDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            className="pl-10 bg-card border-border"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-technical-sm">
                {editingId ? "Editar Aluno" : "Novo Aluno"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nome</label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="bg-background border-border"
                  placeholder="Nome do aluno"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Matrícula</label>
                <Input
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  className="bg-background border-border"
                  placeholder="Número de matrícula"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Turma</label>
                <select
                  value={formData.turmaId}
                  onChange={(e) => setFormData({ ...formData, turmaId: parseInt(e.target.value) })}
                  className="w-full bg-background border border-border text-foreground rounded px-3 py-2"
                >
                  <option value={0}>Selecione uma turma</option>
                  {turmasData?.items.map((turma: any) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background border-border"
                  placeholder="Email (opcional)"
                  type="email"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Telefone</label>
                <Input
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="bg-background border-border"
                  placeholder="Telefone (opcional)"
                />
              </div>
              <Button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90">
                {editingId ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de Alunos */}
      <div className="tech-box overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-technical-sm">Nome</th>
              <th className="text-left p-4 text-technical-sm">Matrícula</th>
              <th className="text-left p-4 text-technical-sm">Email</th>
              <th className="text-left p-4 text-technical-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunosData?.items.map((aluno: any) => (
              <tr key={aluno.id} className="border-b border-border/50 hover:bg-accent/5">
                <td className="p-4">{aluno.nome}</td>
                <td className="p-4 text-muted-foreground">{aluno.matricula}</td>
                <td className="p-4 text-muted-foreground">{aluno.email || "-"}</td>
                <td className="p-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(aluno)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMutation.mutate({ id: aluno.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {alunosData && alunosData.pages > 1 && (
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
    </div>
  );
}

// ============ USUÁRIOS TAB ============

function AdminUsuariosTab() {
  const { data: usuarios, refetch } = trpc.usuarios.list.useQuery();

  const updateRoleMutation = trpc.usuarios.updateRole.useMutation({
    onSuccess: () => {
      toast.success("Permissão atualizada com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const toggleRole = (userId: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    updateRoleMutation.mutate({ id: userId, role: newRole as "user" | "admin" });
  };

  return (
    <div className="space-y-6">
      <div className="tech-box overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-technical-sm">Nome</th>
              <th className="text-left p-4 text-technical-sm">Email</th>
              <th className="text-left p-4 text-technical-sm">Role</th>
              <th className="text-left p-4 text-technical-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios?.map((user: any) => (
              <tr key={user.id} className="border-b border-border/50 hover:bg-accent/5">
                <td className="p-4">{user.name}</td>
                <td className="p-4 text-muted-foreground">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {user.role === "admin" ? "Admin" : "Visitante"}
                  </span>
                </td>
                <td className="p-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleRole(user.id, user.role)}
                  >
                    {user.role === "admin" ? "Rebaixar" : "Promover"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
