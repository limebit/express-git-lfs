import { app } from "./servers/express";
import { env } from "./utils/env";
import { createServer } from "./servers/ssh";

const port = env.PORT;

app.listen(port);

const sshServer = createServer();

if (sshServer && env.SSH_ENABLED == "true") {
  sshServer.listen(env.SSH_PORT);
}
