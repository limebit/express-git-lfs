describe("Env Utils", () => {
  const cacheEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...cacheEnv };
  });

  afterEach(() => {
    process.env = cacheEnv;
  });

  describe("PORT Env Variable", () => {
    test("PORT can be correctly set", async () => {
      process.env.PORT = "3000";

      const { env } = await import("../../server/utils/env");

      expect(env.PORT).toBe(3000);
    });

    test("PORT has correct default value", async () => {
      process.env.PORT = undefined;

      const { env } = await import("../../server/utils/env");

      expect(env.PORT).toBe(8000);
    });

    test("PORT throws error if PORT is not a number", () => {
      process.env.PORT = "undefined";

      expect(import("../../server/utils/env")).rejects.toThrow();
    });
  });

  describe("HOST Env Variable", () => {
    test("HOST can be correctly set", async () => {
      process.env.HOST = "127.0.0.1";

      const { env } = await import("../../server/utils/env");

      expect(env.HOST).toBe("127.0.0.1");
    });

    test("HOST has correct default value", async () => {
      process.env.HOST = undefined;

      const { env } = await import("../../server/utils/env");

      expect(env.HOST).toBe("localhost");
    });
  });

  describe("PROTOCOL Env Variable", () => {
    test("PROTOCOL can be set to http", async () => {
      process.env.PROTOCOL = "http";

      const { env } = await import("../../server/utils/env");

      expect(env.PROTOCOL).toBe("http");
    });
    test("PROTOCOL can be set to https", async () => {
      process.env.PROTOCOL = "https";

      const { env } = await import("../../server/utils/env");

      expect(env.PROTOCOL).toBe("https");
    });

    test("PROTOCOL has correct default value", async () => {
      process.env.PROTOCOL = undefined;

      const { env } = await import("../../server/utils/env");

      expect(env.PROTOCOL).toBe("http");
    });

    test("PROTOCOL throws error if PROTOCOL is not http or https", () => {
      process.env.PROTOCOL = "undefined";

      expect(import("../../server/utils/env")).rejects.toThrow();
    });
  });

  describe("DATA_FOLDER Env Variable", () => {
    test("DATA_FOLDER can be correctly set", async () => {
      process.env.DATA_FOLDER = "/data";

      const { env } = await import("../../server/utils/env");

      expect(env.DATA_FOLDER).toBe("/data");
    });

    test("DATA_FOLDER is undefined if DATA_FOLDER not set", async () => {
      process.env.DATA_FOLDER = undefined;

      const { env } = await import("../../server/utils/env");

      expect(env.DATA_FOLDER).toBe(undefined);
    });
  });

  describe("API_KEY Env Variable", () => {
    test("API_KEY can be correctly set", async () => {
      process.env.API_KEY = "key";

      const { env } = await import("../../server/utils/env");

      expect(env.API_KEY).toBe("key");
    });

    test("API_KEY throws error if API_KEY is not set", () => {
      process.env.API_KEY = undefined;

      expect(import("../../server/utils/env")).rejects.toThrow();
    });
  });

  describe("JWT_SECRET Env Variable", () => {
    test("JWT_SECRET can be correctly set", async () => {
      process.env.JWT_SECRET = "key";

      const { env } = await import("../../server/utils/env");

      expect(env.JWT_SECRET).toBe("key");
    });

    test("JWT_SECRET throws error if JWT_SECRET is not set", () => {
      process.env.JWT_SECRET = undefined;

      expect(import("../../server/utils/env")).rejects.toThrow();
    });
  });

  describe("JWT_EXPIRES_IN Env Variable", () => {
    test("JWT_EXPIRES_IN can be correctly set", async () => {
      process.env.JWT_EXPIRES_IN = "800";

      const { env } = await import("../../server/utils/env");

      expect(env.JWT_EXPIRES_IN).toBe(800);
    });

    test("JWT_EXPIRES_IN has correct default value", async () => {
      process.env.JWT_EXPIRES_IN = undefined;

      const { env } = await import("../../server/utils/env");

      expect(env.JWT_EXPIRES_IN).toBe(900);
    });

    test("JWT_EXPIRES_IN throws error if JWT_EXPIRES_IN is not a number", () => {
      process.env.JWT_EXPIRES_IN = "undefined";

      expect(import("../../server/utils/env")).rejects.toThrow();
    });
  });

  describe("SSH_ENABLED Env Variable", () => {
    test("SSH_ENABLED can be enabled and dependents can be correctly set", async () => {
      process.env.SSH_ENABLED = "true";
      process.env.SSH_PRIVATE_KEY_PATH = "path";
      process.env.SSH_PORT = "30";

      const { env } = await import("../../server/utils/env");

      expect(env.SSH_ENABLED).toBe("true");
      if (env.SSH_ENABLED !== "true") {
        fail("I have failed you!");
      }
      expect(env.SSH_PRIVATE_KEY_PATH).toBe("path");
      expect(env.SSH_PORT).toBe(30);
    });

    test("SSH_ENABLED can be disabled and dependents are not set", async () => {
      process.env.SSH_ENABLED = "false";
      process.env.SSH_PRIVATE_KEY_PATH = "path";
      process.env.SSH_PORT = "30";

      const { env } = await import("../../server/utils/env");

      expect(env.SSH_ENABLED).toBe("false");
      // @ts-expect-error
      expect(env.SSH_PRIVATE_KEY_PATH).toBe(undefined);
      // @ts-expect-error
      expect(env.SSH_PORT).toBe(undefined);
    });

    test("SSH_ENABLED can be unset and dependents are not set", async () => {
      process.env.SSH_ENABLED = undefined;
      process.env.SSH_PRIVATE_KEY_PATH = "path";
      process.env.SSH_PORT = "30";

      const { env } = await import("../../server/utils/env");

      expect(env.SSH_ENABLED).toBe(undefined);
      // @ts-expect-error
      expect(env.SSH_PRIVATE_KEY_PATH).toBe(undefined);
      // @ts-expect-error
      expect(env.SSH_PORT).toBe(undefined);
    });

    test("SSH_PORT has correct default value", async () => {
      process.env.SSH_ENABLED = "true";

      const { env } = await import("../../server/utils/env");

      expect(env.SSH_ENABLED).toBe("true");
      if (env.SSH_ENABLED !== "true") {
        fail("I have failed you!");
      }
      expect(env.SSH_PORT).toBe(22);
    });

    test("SSH_ENABLED throws error if SSH_PRIVATE_KEY_PATH is not set", () => {
      process.env.SSH_ENABLED = "true";
      process.env.SSH_PRIVATE_KEY_PATH = undefined;

      expect(import("../../server/utils/env")).rejects.toThrow();
    });
  });
});

export {};
