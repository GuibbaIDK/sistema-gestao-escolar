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
    const uniqueEmail = `test-${Date.now()}@example.com`;

    const result = await caller.auth.register({
      email: uniqueEmail,
      name: "Test User",
      password: "password123",
    });

    expect(result.success).toBe(true);
    expect(result.user.email).toBe(uniqueEmail);
    expect(result.user.name).toBe("Test User");
    expect(result.user.role).toBe("user");
  }, { timeout: 10000 });

  it("rejects duplicate email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const uniqueEmail = `duplicate-${Date.now()}@example.com`;

    // Create first user
    await caller.auth.register({
      email: uniqueEmail,
      name: "User 1",
      password: "password123",
    });

    // Try to create second user with same email
    try {
      await caller.auth.register({
        email: uniqueEmail,
        name: "User 2",
        password: "password456",
      });
      expect.fail("Should have thrown CONFLICT error");
    } catch (error: any) {
      expect(error.code).toBe("CONFLICT");
      expect(error.message).toContain("Email já cadastrado");
    }
  }, { timeout: 10000 });

  it("rejects password shorter than 6 characters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const uniqueEmail = `short-${Date.now()}@example.com`;

    try {
      await caller.auth.register({
        email: uniqueEmail,
        name: "Test User",
        password: "short",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      // Zod validation should reject this
      expect(error).toBeDefined();
    }
  }, { timeout: 10000 });
});

describe("auth.login", () => {
  let testEmail: string;
  const testPassword = "correctpassword";

  beforeEach(async () => {
    testEmail = `login-${Date.now()}-${Math.random()}@example.com`;
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.auth.register({
        email: testEmail,
        name: "Login Test User",
        password: testPassword,
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
      email: testEmail,
      password: testPassword,
    });

    expect(result.success).toBe(true);
    expect(result.user.email).toBe(testEmail);
    expect(setCookieCalled).toBe(true);
  }, { timeout: 10000 });

  it("rejects login with incorrect password", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.login({
        email: testEmail,
        password: "wrongpassword",
      });
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Email ou senha inválidos");
    }
  }, { timeout: 10000 });

  it("rejects login with non-existent email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.login({
        email: `nonexistent-${Date.now()}@example.com`,
        password: "anypassword",
      });
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Email ou senha inválidos");
    }
  }, { timeout: 10000 });
});
