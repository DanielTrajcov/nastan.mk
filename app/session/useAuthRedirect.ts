import { useSession } from "next-auth/react";
import { Session } from "next-auth"; // Correct import for Session type
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useAuthRedirect = (): { session: Session | null; status: string } => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect unauthenticated users to the home page
    }
  }, [status, router]);

  return { session, status }; // Return session and status
};

export default useAuthRedirect;
