import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }) {
        if (args.data.password) {
          args.data.password = await hashPassword(args.data.password);
        }
        return query(args);
      },
      async update({ args, query }) {
        if (args.data.password) {
          args.data.password = await hashPassword(args.data.password);
        }
        return query(args);
      },
    },
  },
});

async function hashPassword(password) {
  if (!password.startsWith('$2b$')) {
    return await bcrypt.hash(password, 10);
  }
  return password;
}

export default prisma;
