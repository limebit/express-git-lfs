import { prisma } from "../utils/prisma";
import { utils } from "ssh2";
import type { PublicKeyAuthContext } from "ssh2";
import { Authenticator, setMissingAuthHeaders } from ".";
import { verifyJWT } from "../utils/jwt";
import { timingSafeEqualCheck } from "../utils/crypt";

interface SSHAuthenticatorInterface extends Authenticator {
  checkSSHAuthentication: (ctx: PublicKeyAuthContext) => Promise<boolean>;
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
  async checkSSHAuthentication(ctx) {
    const users = await prisma.user.findMany({ include: { sshKeys: true } });

    const signature = ctx.signature;
    const blob = ctx.blob;
    const algo = ctx.key.algo;

    const user = users.find((user) =>
      user.sshKeys.some((key) => {
        const parsedKey = utils.parseKey(key.key);
        if (parsedKey instanceof Error) return false;

        if (
          parsedKey.type != algo ||
          !timingSafeEqualCheck(ctx.key.data, parsedKey.getPublicSSH())
        )
          return false;

        if (!blob || !signature) return true;

        return parsedKey.verify(blob, signature);
      })
    );

    if (!user) return false;

    return true;
  },
};
