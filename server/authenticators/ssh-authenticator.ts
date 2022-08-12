import { prisma } from "../utils/prisma";
import { utils } from "ssh2";
import { Authenticator, setMissingAuthHeaders } from ".";
import { generateJWT, verifyJWT } from "./jwt";

interface SSHAuthenticatorInterface extends Authenticator {
  checkSSHAuthentication: (
    signature: Buffer,
    blob: Buffer
  ) => Promise<{ isAuthorized: boolean; token?: string }>;
}

export const SSHAuthenticator: SSHAuthenticatorInterface = {
  async checkAuthorization(res, authorizationHeader) {
    const authorization = authorizationHeader.split(" ");

    if (authorization[0] != "Bearer" || !authorization[1]) {
      setMissingAuthHeaders(res);
      return false;
    }

    const credentials = verifyJWT<{ isAuthorized: boolean }>(authorization[1]);

    if (!credentials.isVerified || !credentials.payload) return false;

    const { isAuthorized } = credentials.payload;

    return isAuthorized;
  },
  async checkSSHAuthentication(signature, blob) {
    const users = await prisma.user.findMany({ include: { sshKeys: true } });

    const user = users.find((user) =>
      user.sshKeys.some((key) => {
        const parsedKey = utils.parseKey(key.key);
        if (parsedKey instanceof Error) return false;

        return parsedKey.verify(blob, signature);
      })
    );

    if (!user) return { isAuthorized: false };

    const token = generateJWT({ isAuthorized: true });

    return { isAuthorized: true, token };
  },
};
