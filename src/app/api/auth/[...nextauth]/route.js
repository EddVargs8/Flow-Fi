import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '../../../utils/prisma';
import bcrypt from 'bcrypt';

const authHandler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
if (!isMatch) {
  throw new Error("Credenciales inválidas");
}


        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});

export const GET = authHandler;
export const POST = authHandler;
