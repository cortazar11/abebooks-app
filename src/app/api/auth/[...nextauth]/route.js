import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt", // IMPORTANT for your current setup
  },

  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.sub = user.id
        }
        return token
      },

      async session({ session, token }) {
        if (session?.user && token?.sub) {
          session.user.id = token.sub
        }
        return session
      },
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }