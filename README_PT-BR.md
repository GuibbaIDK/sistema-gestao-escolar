# 🎓 Sistema de Gestão Escolar

Plataforma moderna e profissional para gerenciar turmas, alunos e usuários com segurança e eficiência.

## 🚀 Características Principais

- **Autenticação Segura**: Login/cadastro local com email e senha (bcrypt)
- **Controle de Acesso**: Dois níveis de permissão (Admin e Visitante)
- **Gestão de Turmas**: CRUD completo com paginação, busca e filtros
- **Gestão de Alunos**: Registro e acompanhamento de alunos por turma
- **Gerenciamento de Usuários**: Listar e promover/rebaixar permissões
- **Dashboard Administrativo**: Interface intuitiva com sidebar de navegação
- **Design Moderno**: Interface colorida e responsiva com gradientes vibrantes

## 🛠️ Stack Tecnológico

### Frontend
- React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Vite (dev server ultra-rápido)
- TanStack React Query + tRPC

### Backend
- Express 4 + Node.js
- tRPC 11 (RPC type-safe)
- JWT + bcrypt (autenticação)

### Banco de Dados
- MySQL/TiDB
- Drizzle ORM + Drizzle Kit

### Testes
- Vitest (testes unitários)

## 📋 Credenciais Padrão

Para acessar o painel administrativo:
- **Email**: admin@gmail.com
- **Senha**: admin

## 🎯 Como Usar

### 1. Fazer Login
Acesse a página de login e insira suas credenciais (email e senha).

### 2. Painel Administrativo (Admin)
Após fazer login como admin, você terá acesso a:
- **Turmas**: Criar, editar, listar e deletar turmas
- **Alunos**: Gerenciar alunos e vinculá-los a turmas
- **Usuários**: Gerenciar permissões de outros usuários

### 3. Modo Visitante
Usuários com permissão de visitante podem:
- Visualizar turmas disponíveis
- Ver detalhes de turmas e alunos (modo leitura)
- Fazer logout

## 📱 Funcionalidades

### Turmas
- ✅ Criar nova turma (nome, ano, turno, descrição)
- ✅ Listar turmas com paginação
- ✅ Buscar turmas por nome
- ✅ Filtrar por ano ou turno
- ✅ Editar informações da turma
- ✅ Deletar turma

### Alunos
- ✅ Criar novo aluno (nome, matrícula, turma, contato)
- ✅ Listar alunos com paginação
- ✅ Buscar alunos por nome ou matrícula
- ✅ Editar dados do aluno
- ✅ Deletar aluno
- ✅ Vincular aluno a turma

### Usuários
- ✅ Listar todos os usuários
- ✅ Promover usuário a admin
- ✅ Rebaixar admin para visitante
- ✅ Visualizar role e data de criação

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação via JWT
- Cookies HTTP-only para sessões
- Proteção de rotas por role
- Validação de entrada no backend

## 🎨 Design

Interface moderna com:
- Gradientes vibrantes (cyan, blue, purple)
- Animações suaves e responsivas
- Tema escuro profissional
- Componentes acessíveis (shadcn/ui)
- Layout responsivo para mobile/desktop

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o administrador do sistema.

---

**Versão**: 1.0.0  
**Última atualização**: Junho 2024
