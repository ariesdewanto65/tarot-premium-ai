import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DIRECT_URL;

console.log(
  "PRISMA RUNTIME URL:",
  connectionString ? "DIRECT_URL ADA" : "DIRECT_URL KOSONG"
);

if (connectionString) {
  const safeUrl = new URL(connectionString);

  console.log("PRISMA HOST:", safeUrl.hostname);
  console.log("PRISMA PORT:", safeUrl.port);
  console.log("PRISMA USER:", safeUrl.username);
}

if (!connectionString) {
  throw new Error("DIRECT_URL tidak ditemukan");
}

const adapter = new PrismaPg({
  connectionString,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}