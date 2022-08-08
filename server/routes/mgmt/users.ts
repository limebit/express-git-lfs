import type { Express, Request, Response } from "express";
import { z } from "zod";
import { validateZodSchema } from "../../utils/zod-middleware";

let users: { username: string; password: string; sshKeys: string[] }[] = [
  { username: "OFranke", password: "Isch hab koa Passwort", sshKeys: [] },
];

const handleGetAllUsers = (_req: Request, res: Response) => {
  console.log(users);

  return res.status(200).send({ users: users });
};

const handleGetUserSchema = z.object({
  params: z.object({
    user: z.string(),
  }),
});

const handleGetUser = (req: Request, res: Response) => {
  type reqType = z.infer<typeof handleGetUserSchema>;

  const { user } = req.params as reqType["params"];

  const userProfile = users.find((element) => element.username == user);

  if (!userProfile) return res.sendStatus(404);

  console.log(users);

  return res.status(200).send({ user: userProfile });
};

const handlePutUserSchema = z.object({
  params: z.object({
    user: z.string(),
  }),
  body: z.object({
    username: z.string().nullish(),
    password: z.string().nullish(),
    sshKeys: z.string().array().nullish(),
  }),
});

const handlePutUser = (req: Request, res: Response) => {
  type reqType = z.infer<typeof handlePutUserSchema>;

  const { user } = req.params as reqType["params"];

  const { username, password, sshKeys } = req.body as reqType["body"];

  const userIndex = users.findIndex((element) => element.username == user);

  if (userIndex === -1 || !users[userIndex]) return res.sendStatus(404);

  if (username) users[userIndex]!.username = username;
  if (password) users[userIndex]!.password = password;
  if (sshKeys) users[userIndex]!.sshKeys = sshKeys;

  console.log(users);

  return res.sendStatus(200);
};

const handleCreateUserSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
    sshKeys: z.string().array().nullish(),
  }),
});

const handleCreateUser = (req: Request, res: Response) => {
  type reqType = z.infer<typeof handleCreateUserSchema>;

  const { username, password, sshKeys } = req.body as reqType["body"];

  const userIndex = users.findIndex((element) => element.username == username);

  if (userIndex !== -1) return res.sendStatus(409);

  users.push({
    username: username,
    password: password,
    sshKeys: sshKeys ?? [],
  });

  console.log(users);

  res.sendStatus(200);
};

export const usersRoute = (app: Express) => {
  app.get("/mgmt/users", handleGetAllUsers);
  app.get(
    "/mgmt/users/:user",
    validateZodSchema(handleGetUserSchema),
    handleGetUser
  );
  app.put(
    "/mgmt/users/:user",
    validateZodSchema(handlePutUserSchema),
    handlePutUser
  );
  app.post(
    "/mgmt/users",
    validateZodSchema(handleCreateUserSchema),
    handleCreateUser
  );
};
