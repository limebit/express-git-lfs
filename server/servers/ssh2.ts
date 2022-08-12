import ssh2 from "ssh2";
import type {
  AuthContext,
  AcceptConnection,
  ServerChannel,
  RejectConnection,
  ExecInfo,
} from "ssh2";
import { getHost, getPort, getProtocol, getRequiredEnvVar } from "../utils/env";
import fs from "fs";
import { SSHAuthenticator } from "../authenticators/ssh-authenticator";
import { generateJWT } from "../utils/jwt";

const sshPrivateKey = fs.readFileSync(
  getRequiredEnvVar("SSH_PRIVATE_KEY_PATH")
);

const authenticationHandler = async (ctx: AuthContext) => {
  const username = ctx.username;
  const method = ctx.method;

  if (username !== "git" || method !== "publickey") return ctx.reject();

  const signature = ctx.signature;
  const blob = ctx.blob;

  if (!signature || !blob) return ctx.accept();

  const isAuthenticated = await SSHAuthenticator.checkSSHAuthentication(
    signature,
    blob
  );

  if (!isAuthenticated) return ctx.reject();

  return ctx.accept();
};

const execHandler = (
  accept: AcceptConnection<ServerChannel>,
  _: RejectConnection,
  info: ExecInfo
) => {
  const stream = accept();

  const command = info.command;
  const commands = command.split(" ");

  if (
    commands.length < 3 ||
    commands[0]?.toLowerCase() != "git-lfs-authenticate" ||
    !(commands[2] == "download" || commands[2] == "upload")
  ) {
    stream.exit(0);
    return stream.end();
  }

  const token = generateJWT({ isAuthorized: true });

  const host = getHost();
  const protocol = getProtocol();
  const port = getPort();

  stream.write(
    JSON.stringify({
      header: {
        Authorization: `Bearer ${token}`,
      },
      href: `${protocol}://${host}:${port}/${commands[1]}`,
    })
  );
  stream.exit(0);
  stream.end();
};

export const sshServer = new ssh2.Server(
  { hostKeys: [sshPrivateKey] },
  (client) => {
    client.on("authentication", authenticationHandler).on("ready", () => {
      client.on("session", (accept) => {
        const session = accept();

        session.on("exec", execHandler);
      });
    });
  }
);
