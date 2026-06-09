import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

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
          nome: z.string().min(1).optional(),
          ano: z.string().min(1).optional(),
          turno: z.string().min(1).optional(),
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
    // Listar alunos (público com paginação, busca e filtro por turma)
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
          nome: z.string().min(1).optional(),
          matricula: z.string().min(1).optional(),
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
  usuarios: router({
    // Listar todos os usuários (admin only)
    list: adminProcedure.query(async () => {
      const users = await db.getAllUsers();
      return users;
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
