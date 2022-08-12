import { app } from "./servers/express";
import "dotenv/config";
import { getPort } from "./utils";

const port = getPort();

app.listen(port);
