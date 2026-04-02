import { TextEncoder } from "node:util";

const jwtVerifyMock = jest.fn();
const signMock = jest.fn();
const setProtectedHeaderMock = jest.fn();
const setSubjectMock = jest.fn();
const setIssuedAtMock = jest.fn();
const setExpirationTimeMock = jest.fn();

jest.mock("jose", () => ({
  jwtVerify: (...args: unknown[]) => jwtVerifyMock(...args),
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: (...args: unknown[]) => {
      setProtectedHeaderMock(...args);
      return {
        setSubject: (...subjectArgs: unknown[]) => {
          setSubjectMock(...subjectArgs);
          return {
            setIssuedAt: (...issuedAtArgs: unknown[]) => {
              setIssuedAtMock(...issuedAtArgs);
              return {
                setExpirationTime: (...expirationArgs: unknown[]) => {
                  setExpirationTimeMock(...expirationArgs);
                  return {
                    sign: (...signArgs: unknown[]) => signMock(...signArgs),
                  };
                },
              };
            },
          };
        },
      };
    },
  })),
}));

import { authCookieMaxAge, authCookieName, createUserToken, verifyUserToken } from "./jwt";

Object.defineProperty(globalThis, "TextEncoder", {
  value: TextEncoder,
  writable: true,
});

describe("jwt utilities", () => {
  const originalSecret = process.env.AUTH_JWT_SECRET;

  beforeEach(() => {
    process.env.AUTH_JWT_SECRET = "test-secret-for-jwt-signing";
    jwtVerifyMock.mockReset();
    signMock.mockReset();
    setProtectedHeaderMock.mockReset();
    setSubjectMock.mockReset();
    setIssuedAtMock.mockReset();
    setExpirationTimeMock.mockReset();
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.AUTH_JWT_SECRET;
      return;
    }
    process.env.AUTH_JWT_SECRET = originalSecret;
  });

  it("exports stable auth cookie settings", () => {
    expect(authCookieName).toBe("auth_token");
    expect(authCookieMaxAge).toBe(60 * 60 * 24);
  });

  it("creates and verifies a token with expected payload", async () => {
    signMock.mockResolvedValueOnce("signed-token");
    jwtVerifyMock.mockResolvedValueOnce({
      payload: { sub: "user-123", username: "alice" },
    });

    const token = await createUserToken("user-123", "alice");
    const payload = await verifyUserToken(token);

    expect(token).toBe("signed-token");
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe("user-123");
    expect(payload?.username).toBe("alice");
  });

  it("returns null for an invalid token", async () => {
    jwtVerifyMock.mockRejectedValueOnce(new Error("invalid"));
    const payload = await verifyUserToken("invalid-token");
    expect(payload).toBeNull();
  });

  it("throws when creating token without secret", async () => {
    delete process.env.AUTH_JWT_SECRET;
    await expect(createUserToken("user-123", "alice")).rejects.toThrow("Missing AUTH_JWT_SECRET");
  });
});
