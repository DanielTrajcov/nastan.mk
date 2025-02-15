import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // Import Google provider
import FacebookProvider from "next-auth/providers/facebook"; // Import Facebook provider
import { auth } from "../../../shared/firebaseConfig"; // Import your Firebase auth object

const handler = NextAuth({
  providers: [
    // Credentials provider (Firebase email/password authentication)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Check if email and password are provided
        if (!email || !password) {
          console.error("Error: Missing email or password");
          return null; // Return null if credentials are missing
        }

        try {
          // Attempt direct Firebase Authentication
          const userCredential = await auth.signInWithEmailAndPassword(email, password);

          // If user is found, return the user data
          if (userCredential?.user) {
            console.log("Firebase Sign-In Successful: ", userCredential.user);
            return {
              id: userCredential.user.uid,
              name: userCredential.user.displayName || "No name", // Handle missing displayName
              email: userCredential.user.email,
            };
          }
        } catch (error) {
          // Log error to help debug
          console.error("Error during Firebase sign-in:", error.message);

          // Custom error handling
          if (error.code === 'auth/user-not-found') {
            console.error("Error: No user found with this email.");
            return null; // Return null (user not found)
          } else if (error.code === 'auth/wrong-password') {
            console.error("Error: Incorrect password entered.");
            return null; // Return null (wrong password)
          } else {
            console.error("Error: Unknown Firebase error:", error.message);
            return null; // Return null (unknown error)
          }
        }
      },
    }),

    // Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret
    }),

    // Facebook provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID, // Your Facebook Client ID
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET, // Your Facebook Client Secret
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have a secret set for JWT
  pages: {
    error: "/auth/error", // Optional: Add custom error page for authentication issues
  },
  session: {
    strategy: "jwt", // Ensure you use JWT session strategy if you're using JWT tokens
  },
});

export { handler as GET, handler as POST };
