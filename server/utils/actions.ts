import { getHost, getProtocol, getPort } from ".";
import { generateJWT, getExpiresIn } from "../authenticators/jwt";

export const getUploadAction = (gitUser: string, repo: string, oid: string) => {
  const host = getHost();
  const protocol = getProtocol();
  const port = getPort();

  return {
    href: `${protocol}://${host}:${port}/${gitUser}/${repo}/objects/${oid}`,
    expires_in: getExpiresIn(),
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
  const host = getHost();
  const protocol = getProtocol();
  const port = getPort();

  return {
    href: `${protocol}://${host}:${port}/${gitUser}/${repo}/objects/${oid}`,
    expires_in: getExpiresIn(),
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

export const getVerifyAction = (gitUser: string, repo: string) => {
  const host = getHost();
  const protocol = getProtocol();
  const port = getPort();

  return {
    href: `${protocol}://${host}:${port}/${gitUser}/${repo}/verify`,
    expires_in: getExpiresIn(),
    header: {
      Authorization: `Bearer ${generateJWT({
        gitUser,
        repo,
        action: "verify",
      })}`,
    },
  };
};
