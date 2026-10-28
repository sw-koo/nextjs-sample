import { PrismaClient } from '@prisma/client';
const globalDb = globalThis as unknown as { validationDb?: PrismaClient };
export const db = globalDb.validationDb ?? new PrismaClient();
globalDb.validationDb = db;
