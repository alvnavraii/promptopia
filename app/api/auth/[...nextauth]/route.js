import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/utils/database";
import User from "@/models/user";

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (!session?.user?.email) {
        console.error("Session user email is undefined");
        return session;
      }

      try {
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user.email });
        if (!sessionUser) {
          console.error("User not found");
          return session;
        }
        session.user.id = sessionUser._id.toString();
        return session;
      } catch (error) {
        console.error("Error fetching user:", error);
        return session;
      }
    },
    async signIn({ profile }) {
      console.log("signIn", profile);
      try {
        await connectToDB();
        const userExists = await User.findOne({ email: profile.email });
        if (!userExists) {
          const newUser = new User({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
          await newUser.save();
        }
        return true;
      } catch (error) {
        console.error("Error signing in:", error);
        return false;
      }
    },
  },
};

export const GET = async (req, res) => {
  return NextAuth(req, res, options);
};

export const POST = async (req, res) => {
  return NextAuth(req, res, options);
};
