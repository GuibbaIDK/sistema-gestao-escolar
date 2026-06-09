import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, foreignKey } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  passwordHash: text("passwordHash"),
  emailVerified: timestamp("emailVerified"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de Turmas
 * Armazena as turmas da escola (ex: 3º Ano A, 3º Ano B, etc)
 */
export const turmas = mysqlTable("turmas", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  ano: varchar("ano", { length: 4 }).notNull(),
  turno: varchar("turno", { length: 50 }).notNull(),
  descricao: text("descricao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Turma = typeof turmas.$inferSelect;
export type InsertTurma = typeof turmas.$inferInsert;

/**
 * Tabela de Alunos
 * Armazena os alunos e sua vinculação com turmas
 */
export const alunos = mysqlTable(
  "alunos",
  {
    id: int("id").autoincrement().primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull(),
    matricula: varchar("matricula", { length: 50 }).notNull().unique(),
    turmaId: int("turmaId").notNull(),
    email: varchar("email", { length: 320 }),
    telefone: varchar("telefone", { length: 20 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    turmaIdFk: foreignKey({
      columns: [table.turmaId],
      foreignColumns: [turmas.id],
    }).onDelete("cascade"),
  })
);

export type Aluno = typeof alunos.$inferSelect;
export type InsertAluno = typeof alunos.$inferInsert;

/**
 * Relações entre tabelas
 */
export const turmasRelations = relations(turmas, ({ many }) => ({
  alunos: many(alunos),
}));

export const alunosRelations = relations(alunos, ({ one }) => ({
  turma: one(turmas, {
    fields: [alunos.turmaId],
    references: [turmas.id],
  }),
}));
