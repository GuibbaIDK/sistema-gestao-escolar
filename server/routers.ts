import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcrypt";
import { SignJWT } from "jose";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),

    // Registro local
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().min(1),
          password: z.string().min(6),
        })
      )
      .mutation(async ({ input }) => {
        // Verificar se email já existe
        const existingUser = await db.getUserByEmail(input.email);
        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email já cadastrado",
          });
        }

        // Hash da senha
        const passwordHash = await bcrypt.hash(input.password, 10);

        // Criar usuário
        const result = await db.createLocalUser(input.email, input.name, passwordHash);

        // Buscar usuário criado
        const user = await db.getUserByEmail(input.email);
        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao criar usuário",
          });
        }

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        };
      }),

    // Login local
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Buscar usuário
        const user = await db.getUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email ou senha inválidos",
          });
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
        if (!isPasswordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email ou senha inválidos",
          });
        }

        // Atualizar lastSignedIn
        await db.updateUserLastSignedIn(user.id);

        // Criar JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");
        const token = await new SignJWT({
          userId: user.id,
          email: user.email,
          role: user.role,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("7d")
          .sign(secret);

        // Setar cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        const cookieValue = `${COOKIE_NAME}=${token}; Path=/; ${cookieOptions.secure ? "Secure; " : ""}${cookieOptions.sameSite ? `SameSite=${cookieOptions.sameSite}; ` : ""}HttpOnly; Max-Age=604800`;
        ctx.res.setHeader("Set-Cookie", cookieValue);

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        };
      }),
  }),

  // ============ TURMAS ============
  turmas: router({
    // Listar turmas (público com paginação e busca)
    list: publicProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const offset = (input.page - 1) * input.limit;
        const items = await db.getTurmas(input.limit, offset, input.search);
        const total = await db.getTurmasCount(input.search);
        return {
          items,
          total,
          page: input.page,
          limit: input.limit,
          pages: Math.ceil(total / input.limit),
        };
      }),

    // Obter turma por ID (público)
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const turma = await db.getTurmaById(input.id);
        if (!turma) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Turma não encontrada" });
        }
        return turma;
      }),

    // Criar turma (admin only)
    create: adminProcedure
      .input(
        z.object({
          nome: z.string().min(1),
          ano: z.string().min(1),
          turno: z.string().min(1),
          descricao: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createTurma(input);
        return { success: true };
      }),

    // Editar turma (admin only)
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          nome: z.string().optional(),
          ano: z.string().optional(),
          turno: z.string().optional(),
          descricao: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateTurma(id, data);
        return { success: true };
      }),

    // Deletar turma (admin only)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTurma(input.id);
        return { success: true };
      }),
  }),

  // ============ ALUNOS ============
  alunos: router({
    // Listar alunos (público com paginação e busca)
    list: publicProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
          search: z.string().optional(),
          turmaId: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        const offset = (input.page - 1) * input.limit;
        const items = await db.getAlunos(input.limit, offset, input.search, input.turmaId);
        const total = await db.getAlunosCount(input.search, input.turmaId);
        return {
          items,
          total,
          page: input.page,
          limit: input.limit,
          pages: Math.ceil(total / input.limit),
        };
      }),

    // Obter aluno por ID (público)
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const aluno = await db.getAlunoById(input.id);
        if (!aluno) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Aluno não encontrado" });
        }
        return aluno;
      }),

    // Criar aluno (admin only)
    create: adminProcedure
      .input(
        z.object({
          nome: z.string().min(1),
          matricula: z.string().min(1),
          turmaId: z.number(),
          email: z.string().email().optional(),
          telefone: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createAluno(input);
        return { success: true };
      }),

    // Editar aluno (admin only)
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          nome: z.string().optional(),
          matricula: z.string().optional(),
          turmaId: z.number().optional(),
          email: z.string().email().optional(),
          telefone: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateAluno(id, data);
        return { success: true };
      }),

    // Deletar aluno (admin only)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteAluno(input.id);
        return { success: true };
      }),
  }),

  // ============ USUÁRIOS ============
  users: router({
    // Listar usuários (admin only)
    list: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),

    // Promover/rebaixar usuário (admin only)
    updateRole: adminProcedure
      .input(
        z.object({
          id: z.number(),
          role: z.enum(["user", "admin"]),
        })
      )
      .mutation(async ({ input }) => {
        await db.updateUserRole(input.id, input.role);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
