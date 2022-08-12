import { prisma } from "../utils/prisma";
import type { Authenticator } from ".";
import { validatePassword } from "../utils/crypt";
import type { Response } from "express";

interface BasicAuthenticatorInterface extends Authenticator {
  setHeaders: (res: Response) => void;
}

export const BasicAuthenticator: BasicAuthenticatorInterface = {
  setHeaders(res) {
    res.set("LFS-Authenticate", 'Basic realm="Git LFS"');
  },
  async checkAuthorization(req, res) {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      this.setHeaders(res);
      return false;
    }

    const authorization = authorizationHeader.split(" ");

    if (authorization[0] != "Basic" || !authorization[1]) {
      this.setHeaders(res);
      return false;
    }

    const usernamePassword = Buffer.from(authorization[1], "base64")
      .toString()
      .split(":");

    if (!usernamePassword[0] || !usernamePassword[1]) {
      this.setHeaders(res);
      return false;
    }

    const user = await prisma.user.findFirst({
      where: { username: usernamePassword[0] },
    });

    if (!user) {
      this.setHeaders(res);
      return false;
    }

    const isValid = await validatePassword(usernamePassword[1], user.password);

    if (!isValid) {
      this.setHeaders(res);
      return false;
    }

    return true;
  },
};
