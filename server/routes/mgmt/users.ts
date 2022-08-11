import type { Express, Request, Response } from "express";
import { z } from "zod";
import { validateZodSchema } from "../../utils/zod-middleware";
import { prisma } from "../../utils/prisma";
import { hashPassword } from "../../utils/crypt";
import { validateApiKey } from "../../utils/api-key-middleware";

const handleGetAllUsers = async (_req: Request, res: Response) => {
  const rawUsers = await prisma.user.findMany({
    select: { id: true, username: true, sshKeys: { select: { key: true } } },
  });

  const users = rawUsers.map((user) => ({
    ...user,
    sshKeys: user.sshKeys.map((key) => key.key),
  }));

  return res.status(200).send({ users: users });
};

const handleCreateUserSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
    sshKeys: z.string().array().nullish(),
  }),
});

const handleCreateUser = async (req: Request, res: Response) => {
  type reqType = z.infer<typeof handleCreateUserSchema>;

  const { username, password, sshKeys } = req.body as reqType["body"];

  const userId = await prisma.user.findFirst({
    where: { username: username },
    select: { id: true },
  });

  if (userId) return res.sendStatus(409);

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
      sshKeys: sshKeys
        ? { create: sshKeys.map((key) => ({ key })) }
        : undefined,
    },
  });

  return res.sendStatus(200);
};

const handleGetUserSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
});

const handleGetUser = async (req: Request, res: Response) => {
  type reqType = z.infer<typeof handleGetUserSchema>;

  const { userId } = req.params as reqType["params"];

  const userProfile = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true, username: true, sshKeys: { select: { key: true } } },
  });

  if (!userProfile) return res.sendStatus(404);

  return res.status(200).send({
    user: {
      ...userProfile,
      sshKeys: userProfile.sshKeys.map((key) => key.key),
    },
  });
};

const handlePutUserSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
  body: z.object({
    username: z.string().nullish(),
    password: z.string().nullish(),
    sshKeys: z.string().array().nullish(),
  }),
});

const handlePutUser = async (req: Request, res: Response) => {
  type reqType = z.infer<typeof handlePutUserSchema>;

  const { userId } = req.params as reqType["params"];

  const { username, password, sshKeys } = req.body as reqType["body"];

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) return res.sendStatus(404);

  const hashedPassword = password ? await hashPassword(password) : undefined;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      username: username ?? undefined,
      password: hashedPassword ?? undefined,
      sshKeys: sshKeys
        ? {
            deleteMany: {},
            create: sshKeys.map((key) => ({ key })),
          }
        : undefined,
    },
  });

  return res.sendStatus(200);
};

const handleDeleteUserSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
});

export const handleDeleteUser = async (req: Request, res: Response) => {
  type reqType = z.infer<typeof handleDeleteUserSchema>;

  const { userId } = req.params as reqType["params"];

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) return res.sendStatus(404);

  await prisma.user.delete({ where: { id: user.id } });

  return res.sendStatus(200);
};

export const usersRoute = (app: Express) => {
  app.get("/mgmt/users", validateApiKey, handleGetAllUsers);
  app.post(
    "/mgmt/users",
    validateApiKey,
    validateZodSchema(handleCreateUserSchema),
    handleCreateUser
  );
  app.get(
    "/mgmt/users/:userId",
    validateApiKey,
    validateZodSchema(handleGetUserSchema),
    handleGetUser
  );
  app.put(
    "/mgmt/users/:userId",
    validateApiKey,
    validateZodSchema(handlePutUserSchema),
    handlePutUser
  );
  app.delete(
    "/mgmt/users/:userId",
    validateApiKey,
    validateZodSchema(handleDeleteUserSchema),
    handleDeleteUser
  );
};
