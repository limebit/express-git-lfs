import { prisma } from "../utils/prisma";
import { Authenticator, setMissingAuthHeaders } from ".";
import { validatePassword } from "../utils/crypt";

export const BasicAuthenticator: Authenticator = {
  async checkAuthorization(res, authorizationHeader) {
    const authorization = authorizationHeader.split(" ");

    if (authorization[0] != "Basic" || !authorization[1]) {
      setMissingAuthHeaders(res);
      return false;
    }

    const usernamePassword = Buffer.from(authorization[1], "base64")
      .toString()
      .split(":");

    if (!usernamePassword[0] || !usernamePassword[1]) {
      setMissingAuthHeaders(res);
      return false;
    }

    const user = await prisma.user.findFirst({
      where: { username: usernamePassword[0] },
    });

    if (!user) {
      setMissingAuthHeaders(res);
      return false;
    }

    const isValid = await validatePassword(usernamePassword[1], user.password);

    if (!isValid) {
      setMissingAuthHeaders(res);
      return false;
    }

    return true;
  },
};
