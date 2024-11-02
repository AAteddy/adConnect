// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../utils/mongodb';
import Admin from '../../../models/Admin'; // Assuming you have an Admin model with hashed passwords
import bcrypt from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      // Define the name of the login form (this name will be displayed on the login page)
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect(); // Connect to the database

        // Fetch the admin user based on email
        const user = await Admin.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        // Verify the password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return user object without the password
        return { id: user._id, name: user.name, email: user.email };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login', // Redirect user to this page for login
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your environment variables
});