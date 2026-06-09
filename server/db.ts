import { eq, like, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, turmas, alunos } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ TURMAS ============

export async function getTurmas(limit: number = 10, offset: number = 0, searchQuery?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(turmas) as any;

  if (searchQuery) {
    query = query.where(
      like(turmas.nome, `%${searchQuery}%`)
    );
  }

  const result = await query
    .orderBy(desc(turmas.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

export async function getTurmasCount(searchQuery?: string) {
  const db = await getDb();
  if (!db) return 0;

  let query = db.select().from(turmas) as any;

  if (searchQuery) {
    query = query.where(
      like(turmas.nome, `%${searchQuery}%`)
    );
  }

  const result = await query;
  return result.length;
}

export async function getTurmaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(turmas).where(eq(turmas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTurma(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(turmas).values(data);
  return result;
}

export async function updateTurma(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.update(turmas).set(data).where(eq(turmas.id, id));
  return result;
}

export async function deleteTurma(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.delete(turmas).where(eq(turmas.id, id));
  return result;
}

// ============ ALUNOS ============

export async function getAlunos(limit: number = 10, offset: number = 0, searchQuery?: string, turmaId?: number) {
  const db = await getDb();
  if (!db) return [];

  let conditions: any[] = [];

  if (searchQuery) {
    conditions.push(like(alunos.nome, `%${searchQuery}%`));
  }

  if (turmaId) {
    conditions.push(eq(alunos.turmaId, turmaId));
  }

  let query = db.select().from(alunos) as any;

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const result = await query
    .orderBy(desc(alunos.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

export async function getAlunosCount(searchQuery?: string, turmaId?: number) {
  const db = await getDb();
  if (!db) return 0;

  let conditions: any[] = [];

  if (searchQuery) {
    conditions.push(like(alunos.nome, `%${searchQuery}%`));
  }

  if (turmaId) {
    conditions.push(eq(alunos.turmaId, turmaId));
  }

  let query = db.select().from(alunos) as any;

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const result = await query;
  return result.length;
}

export async function getAlunoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(alunos).where(eq(alunos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAluno(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(alunos).values(data);
  return result;
}

export async function updateAluno(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.update(alunos).set(data).where(eq(alunos.id, id));
  return result;
}

export async function deleteAluno(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.delete(alunos).where(eq(alunos.id, id));
  return result;
}

// ============ USUÁRIOS ============

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(users).orderBy(desc(users.createdAt));
  return result;
}

export async function updateUserRole(id: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.update(users).set({ role }).where(eq(users.id, id));
  return result;
}
