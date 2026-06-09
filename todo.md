# Sistema de Gestão Escolar - TODO

## Banco de Dados
- [x] Estender schema com tabelas: Turmas, Alunos
- [x] Adicionar campos role='VISITANTE'|'ADMIN' na tabela users
- [x] Gerar e aplicar migrações SQL

## Back-end (tRPC Procedures)

### Autenticação e Usuários
- [x] Criar procedure protegida para listar usuários (admin only)
- [x] Criar procedure protegida para promover/rebaixar usuário (admin only)
- [x] Criar procedure pública para verificar role do usuário logado

### CRUD de Turmas
- [x] Criar procedure pública para listar turmas (com paginação, busca, filtros)
- [x] Criar procedure protegida para criar turma (admin only)
- [x] Criar procedure protegida para editar turma (admin only)
- [x] Criar procedure protegida para deletar turma (admin only)
- [x] Criar procedure pública para obter detalhes de uma turma

### CRUD de Alunos
- [x] Criar procedure pública para listar alunos (com paginação, busca, filtros)
- [x] Criar procedure protegida para criar aluno (admin only)
- [x] Criar procedure protegida para editar aluno (admin only)
- [x] Criar procedure protegida para deletar aluno (admin only)
- [x] Criar procedure pública para obter detalhes de um aluno

## Front-end (Páginas e Componentes)

### Layout e Navegação
- [x] Configurar DashboardLayout com sidebar para admin
- [x] Criar componente de navegação pública (landing page)
- [x] Implementar proteção de rotas (redirect se não autenticado)

### Páginas Públicas
- [x] Criar landing page com visão geral do sistema
- [x] Criar página pública de listagem de turmas (modo leitura)
- [x] Criar página pública de detalhes de turma com alunos

### Páginas Administrativas (Dashboard)
- [x] Criar página de gerenciamento de turmas (CRUD com tabela, paginação, busca, filtros)
- [x] Criar página de gerenciamento de alunos (CRUD com tabela, paginação, busca, filtros)
- [x] Criar página de gerenciamento de usuários (listar, promover/rebaixar role)
- [x] Criar página de perfil do usuário logado

### Componentes Reutilizáveis
- [x] Criar componente de tabela com paginação
- [x] Criar componente de campo de busca
- [x] Criar componente de filtros
- [x] Criar componente de modal para criar/editar registros
- [x] Criar componente de confirmação de exclusão

## Design Técnico/Profissional

### Estilo Visual (Planta Arquitetônica)
- [x] Configurar cores: azul royal profundo, branco para texto e elementos
- [x] Adicionar padrão de grade fina no fundo
- [x] Implementar elementos CAD lineares (molduras, marcadores de dimensão)
- [x] Configurar tipografia sans-serif bold branca com alto contraste
- [x] Aplicar design em todas as páginas (landing, login, dashboard)

## Testes e Validação
- [x] Testar fluxo de login/logout
- [x] Testar acesso por roles (visitante vs admin)
- [x] Testar CRUD de turmas
- [x] Testar CRUD de alunos
- [x] Testar paginação, busca e filtros
- [x] Testar proteção de rotas
- [x] Testar gerenciamento de usuários (promover/rebaixar)

## Finalização
- [x] Revisar toda a aplicação
- [x] Criar checkpoint final
