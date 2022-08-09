import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
  void prisma.$connect();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
    void global.__prisma.$connect();
  }
  prisma = global.__prisma;
}

export { prisma };
