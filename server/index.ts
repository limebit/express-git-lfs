import { app } from "./servers/express";
import "dotenv/config";
import { getPort, getRequiredEnvVar } from "./utils";
import { sshServer } from "./servers/ssh2";

const port = getPort();

app.listen(port);

const useSSH = getRequiredEnvVar("SSH_ENABLED");

if (useSSH == "true") {
  sshServer.listen(22);
}
