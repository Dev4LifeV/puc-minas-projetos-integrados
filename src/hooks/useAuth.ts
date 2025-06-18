import { auth, googleProvider } from "@/firebase-config";
import { signInWithPopup, signOut } from "firebase/auth";

export default function useAuth() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      console.log("Attempting sign in with popup...");
      const result = await signInWithPopup(auth, googleProvider);
      // User is signed in after popup closes successfully.
      // AuthGuard's onAuthStateChanged listener will handle the redirect.
      console.log("Sign in with popup successful:", result.user.uid);
    } catch (error) {
      console.error("Sign in with popup error:", error);
    }
  };

  return { handleSignOut, handleLogin };
}
