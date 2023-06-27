import { generateJWT, verifyJWT } from "../../server/utils/jwt";

describe("JWT Utils", () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1677970800);
  });

  describe("Genearting JWT", () => {
    test("Successfully generate JWT", async () => {
      const payload = { action: "test" };

      const token = generateJWT(payload);

      expect(token).toBe(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiJ0ZXN0IiwiaWF0IjoxNjc3OTcwLCJleHAiOjE2Nzg4NzB9.X7J4Yj12_Sk7L-iEgz_Ag_HM7mwnEK5CfC8GG3ZoM64"
      );
    });
  });

  describe("Verifying JWT", () => {
    test("Successfully verify JWT", async () => {
      const payload = { action: "test" };

      const token = generateJWT(payload);

      const result = verifyJWT(token);

      expect(result).toStrictEqual({
        isVerified: true,
        payload: { ...payload, exp: 1678870, iat: 1677970 },
      });
    });

    test("Reject malformed JWT", async () => {
      const result = verifyJWT("token");

      expect(result).toStrictEqual({ isVerified: false });
    });
  });
});
