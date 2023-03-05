import type { JwtPayload } from "jsonwebtoken";
import {
  getUploadAction,
  getDownloadAction,
  getVerifyAction,
} from "../../server/utils/actions";
import { verifyJWT } from "../../server/utils/jwt";

describe("Actions Utils", () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1677970800);
  });

  test("Generate upload action", async () => {
    const gitUser = "user";
    const repo = "repo";
    const oid = "15";

    const uploadAction = getUploadAction(gitUser, repo, oid);

    const authorizationHeader = uploadAction.header.Authorization.split(" ");
    const token = verifyJWT<JwtPayload>(authorizationHeader[1]!);

    expect(uploadAction).toStrictEqual({
      href: "http://localhost:8000/user/repo/objects/15",
      expires_in: 900,
      header: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnaXRVc2VyIjoidXNlciIsInJlcG8iOiJyZXBvIiwiYWN0aW9uIjoidXBsb2FkIiwib2lkIjoiMTUiLCJpYXQiOjE2Nzc5NzAsImV4cCI6MTY3ODg3MH0.b1MBJB3lbmwQ9qPuOxReIgEPnDFm6EZUWJEaFKFXhvM",
      },
    });
    expect(authorizationHeader.length).toBe(2);
    expect(token.isVerified).toBe(true);
    expect(token.payload).toStrictEqual({
      gitUser,
      repo,
      oid,
      action: "upload",
      iat: 1677970,
      exp: 1678870,
    });
  });

  test("Generate download action", async () => {
    const gitUser = "user";
    const repo = "repo";
    const oid = "15";

    const downloadAction = getDownloadAction(gitUser, repo, oid);

    const authorizationHeader = downloadAction.header.Authorization.split(" ");
    const token = verifyJWT<JwtPayload>(authorizationHeader[1]!);

    expect(downloadAction).toStrictEqual({
      href: "http://localhost:8000/user/repo/objects/15",
      expires_in: 900,
      header: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnaXRVc2VyIjoidXNlciIsInJlcG8iOiJyZXBvIiwiYWN0aW9uIjoiZG93bmxvYWQiLCJvaWQiOiIxNSIsImlhdCI6MTY3Nzk3MCwiZXhwIjoxNjc4ODcwfQ._qPCx-n6d4TUOw7iwFK7jZ6tCvJYTgOzgT5EnFuISPU",
      },
    });
    expect(authorizationHeader.length).toBe(2);
    expect(token.isVerified).toBe(true);
    expect(token.payload).toStrictEqual({
      gitUser,
      repo,
      oid,
      action: "download",
      iat: 1677970,
      exp: 1678870,
    });
  });

  test("Generate verify action", async () => {
    const gitUser = "user";
    const repo = "repo";

    const verifyAction = getVerifyAction(gitUser, repo);

    const authorizationHeader = verifyAction.header.Authorization.split(" ");
    const token = verifyJWT<JwtPayload>(authorizationHeader[1]!);

    expect(verifyAction).toStrictEqual({
      href: "http://localhost:8000/user/repo/verify",
      expires_in: 900,
      header: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnaXRVc2VyIjoidXNlciIsInJlcG8iOiJyZXBvIiwiYWN0aW9uIjoidmVyaWZ5IiwiaWF0IjoxNjc3OTcwLCJleHAiOjE2Nzg4NzB9.8KWdxQZ-JOc-Sl-I7urgoRYKZChqxwbJ2MnwoLG_gyY",
      },
    });
    expect(authorizationHeader.length).toBe(2);
    expect(token.isVerified).toBe(true);
    expect(token.payload).toStrictEqual({
      gitUser,
      repo,
      action: "verify",
      iat: 1677970,
      exp: 1678870,
    });
  });
});
