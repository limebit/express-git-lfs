import express from "express";
import { objectsRoute } from "../routes/objects";
import { verifyRoute } from "../routes/verify";
import { batchRoute } from "../routes/batch";
import { usersRoute } from "../routes/mgmt/users";

export const app = express();

app.use(
  express.json({ type: ["application/vnd.git-lfs+json", "application/json"] })
);

batchRoute(app);
objectsRoute(app);
verifyRoute(app);
usersRoute(app);
