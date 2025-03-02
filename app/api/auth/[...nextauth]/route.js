import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials"; // Import CredentialsProvider
import { setDoc, doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { auth, firestore } from "../../../shared/firebaseConfig"; // Import initialized Firebase app
import { signInWithEmailAndPassword } from "firebase/auth";

const handler = NextAuth({
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Facebook Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),

    // Credentials Provider (for email/password sign-in)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Validate email and password
        if (!email || !password) {
          console.error("Error: Missing email or password");
          return null;
        }

        try {
          // Firebase sign-in with email and password
          const userCredential = await signInWithEmailAndPassword(auth, email, password);

          if (userCredential?.user) {
            console.log("Firebase Sign-In Successful: ", userCredential.user);
            return {
              id: userCredential.user.uid,
              name: userCredential.user.displayName || "No name",
              email: userCredential.user.email,
            };
          } else {
            console.error("Error: No user found.");
            return null;
          }
        } catch (error) {
          console.error("Error during Firebase sign-in:", error.message);
          return null;
        }
      },
    }),
  ],

  debug: true,  // Enable debug logging

  callbacks: {
    async signIn({ user, account, profile }) {
      const db = firestore;  // Use the initialized Firestore instance

      // Check if the user is signing in with Google or Facebook
      if (account.provider === "google" || account.provider === "facebook") {
        const userRef = doc(db, "users", user.email);

        const userDoc = await getDoc(userRef);

        // If the user doesn't exist in Firestore, create a new record
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            email: user.email,
            name: user.name,
            image: user.image,
            createdAt: new Date(),
          });
        }
      }

      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  pages: {
    error: "/auth/error", // Custom error page
  },
});

export { handler as GET, handler as POST };
