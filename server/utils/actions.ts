import { env } from "./env";
import { generateJWT } from "./jwt";

export const getUploadAction = (gitUser: string, repo: string, oid: string) => {
  const host = env.HOST;
  const protocol = env.PROTOCOL;
  const port = env.PORT;

  return {
    href: `${protocol}://${host}:${port}/${gitUser}/${repo}/objects/${oid}`,
    expires_in: env.JWT_EXPIRES_IN,
    header: {
      Authorization: `Bearer ${generateJWT({
        gitUser,
        repo,
        action: "upload",
        oid,
      })}`,
    },
  };
};

export const getDownloadAction = (
  gitUser: string,
  repo: string,
  oid: string
) => {
  const host = env.HOST;
  const protocol = env.PROTOCOL;
  const port = env.PORT;

  return {
    href: `${protocol}://${host}:${port}/${gitUser}/${repo}/objects/${oid}`,
    expires_in: env.JWT_EXPIRES_IN,
    header: {
      Authorization: `Bearer ${generateJWT({
        gitUser,
        repo,
        action: "download",
        oid,
      })}`,
    },
  };
};

export const getVerifyAction = (gitUser: string, repo: string, oid: string) => {
  const host = env.HOST;
  const protocol = env.PROTOCOL;
  const port = env.PORT;

  return {
    href: `${protocol}://${host}:${port}/${gitUser}/${repo}/verify/${oid}`,
    expires_in: env.JWT_EXPIRES_IN,
    header: {
      Authorization: `Bearer ${generateJWT({
        gitUser,
        repo,
        action: "verify",
        oid,
      })}`,
    },
  };
};
