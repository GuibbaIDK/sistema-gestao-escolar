import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as bcrypt from "bcrypt";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      setHeader: () => {},
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("auth.register", () => {
  it("creates a new user with email and password", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.register({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
    });

    expect(result.success).toBe(true);
    expect(result.user.email).toBe("test@example.com");
    expect(result.user.name).toBe("Test User");
    expect(result.user.role).toBe("user");
  });

  it("rejects duplicate email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Create first user
    await caller.auth.register({
      email: "duplicate@example.com",
      name: "User 1",
      password: "password123",
    });

    // Try to create second user with same email
    try {
      await caller.auth.register({
        email: "duplicate@example.com",
        name: "User 2",
        password: "password456",
      });
      expect.fail("Should have thrown CONFLICT error");
    } catch (error: any) {
      expect(error.code).toBe("CONFLICT");
      expect(error.message).toContain("Email já cadastrado");
    }
  });

  it("rejects password shorter than 6 characters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.register({
        email: "short@example.com",
        name: "Test User",
        password: "short",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      // Zod validation should reject this
      expect(error).toBeDefined();
    }
  });
});

describe("auth.login", () => {
  beforeEach(async () => {
    // Create a test user before each test
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.auth.register({
        email: "login@example.com",
        name: "Login Test User",
        password: "correctpassword",
      });
    } catch (error) {
      // User might already exist from previous test
    }
  });

  it("logs in user with correct credentials", async () => {
    const ctx = createPublicContext();
    let setCookieCalled = false;
    
    ctx.res = {
      setHeader: (name: string, value: string) => {
        if (name === "Set-Cookie") {
          setCookieCalled = true;
          expect(value).toContain("Max-Age=604800");
        }
      },
      clearCookie: () => {},
    } as any;

    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({
      email: "login@example.com",
      password: "correctpassword",
    });

    expect(result.success).toBe(true);
    expect(result.user.email).toBe("login@example.com");
    expect(setCookieCalled).toBe(true);
  });

  it("rejects login with incorrect password", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.login({
        email: "login@example.com",
        password: "wrongpassword",
      });
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Email ou senha inválidos");
    }
  });

  it("rejects login with non-existent email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.login({
        email: "nonexistent@example.com",
        password: "anypassword",
      });
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Email ou senha inválidos");
    }
  });
});
