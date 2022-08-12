import ssh2 from "ssh2";
import type { AuthContext } from "ssh2";
import { getHost, getPort, getProtocol, getRequiredEnvVar } from "../utils";
import fs from "fs";
import { SSHAuthenticator } from "../authenticators/ssh-authenticator";

const sshPrivateKey = fs.readFileSync(
  getRequiredEnvVar("SSH_PRIVATE_KEY_PATH")
);

export const sshServer = new ssh2.Server(
  { hostKeys: [sshPrivateKey] },
  (client) => {
    let token = {};
    client
      .on("authentication", async (ctx: AuthContext) => {
        const username = ctx.username;
        const method = ctx.method;

        if (username !== "git" || method !== "publickey") return ctx.reject();

        const signature = ctx.signature;
        const blob = ctx.blob;

        if (!signature || !blob) return ctx.accept();

        const payload = await SSHAuthenticator.checkSSHAuthentication(
          signature,
          blob
        );

        if (!payload.isAuthorized || !payload.token) return ctx.reject();

        token = payload.token;

        return ctx.accept();
      })
      .on("ready", () => {
        client.on("session", (accept) => {
          const session = accept();

          session.on("exec", (accept, _, info) => {
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
          });
        });
      });
  }
);
