import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '@/libs/prismadb'
import bcrypt from 'bcrypt'

export const authOptions: AuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
      CredentialsProvider({
          name: 'credentials',
          credentials:{
              email:{
                  label: "email",
                  type: "text",
              },
              password:{
                  label:"password",
                  type:"password"
              },
          },
          async authorize(credentials, req) {
              if(!credentials?.email || !credentials.password){
                  throw new Error('invalid email or password')
              }
  
              const user = await prisma.user.findUnique({
                  where:{
                      email: credentials.email
                  }
              })
  
              if(!user || !user?.hashedPassword){
                  throw new Error('invalid email or password')
  
              }
  
              const isCorrectPassword = await bcrypt.compare(
                  credentials.password,
                  user.hashedPassword
              )
  
              if(!isCorrectPassword){
  
                  throw new Error('invalid email or password')
              }
              return user;
  
          },
      })
    ],
    adapter: PrismaAdapter(prisma),
    pages:{
      signIn: '/login'
    },
    debug: process.env.NODE_ENV !== 'development',
    session:{
      strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
  }
export default NextAuth(authOptions);
