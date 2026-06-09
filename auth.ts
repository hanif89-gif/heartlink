import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi");
        }

        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // Auto-create Admin for development
        if (!user && credentials.email === "admin@gmail.com" && credentials.password === "1234") {
          const hashedPassword = await bcrypt.hash("1234", 10);
          user = await prisma.user.create({
            data: {
              name: "Super Admin",
              email: "admin@gmail.com",
              password: hashedPassword,
              role: "ADMIN",
            }
          });
        }

        if (user && user.role === "BANNED") {
          throw new Error("Akun Anda telah ditangguhkan");
        }

        if (!user || !user.password) {
          throw new Error("Email atau password salah");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Email atau password salah");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.age = (user as any).age;
        token.gender = (user as any).gender;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
        if (session.age) token.age = session.age;
        if (session.gender) token.gender = session.gender;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).age = token.age as number;
        (session.user as any).gender = token.gender as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
