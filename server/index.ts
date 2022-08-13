import { app } from "./servers/express";
import { getPort } from "./utils/env";
import { createServer } from "./servers/ssh";

const port = getPort();

app.listen(port);

const sshServer = createServer();

if (sshServer) {
  sshServer.listen(22);
}
