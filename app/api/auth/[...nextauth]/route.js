import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { config } from 'dotenv';

config()



import User from '@models/user';
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      try {
        // Store the user id from MongoDB to the session
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
        return session;
      } catch (error) {
        console.error("Error fetching user from MongoDB: ", error);
        return session;
      }
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();

        // Check if the user already exists in your MongoDB
        const userExists = await User.findOne({ email: profile.email });

        // If not, create a new document and save the user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("Error checking if user exists or creating user: ", error);
        return false;
      }
    },
  }
});

export { handler as GET, handler as POST };
