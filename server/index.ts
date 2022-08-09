import { app } from "./servers/express";
import "dotenv/config";
import { getEnvVarWithDefault } from "./utils";

const port = parseInt(getEnvVarWithDefault("PORT", "8000"));

app.listen(port);
