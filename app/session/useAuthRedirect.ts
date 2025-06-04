import { useEffect, useState } from "react";
import { auth } from "../shared/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

function useAuthRedirect() {
  const [user, setUser] = useState<User | null>(() => auth.currentUser);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setStatus(firebaseUser ? "authenticated" : "unauthenticated");
    });
    return unsubscribe;
  }, []);

  return { user, status };
}

export default useAuthRedirect;
