import NextAuth from "next-auth";
import { authOptions } from "@/src/lib/auth";

console.log('🚀 NextAuth route loaded');

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
