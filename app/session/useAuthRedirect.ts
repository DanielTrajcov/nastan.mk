import { useSession } from "next-auth/react";
import { Session } from "next-auth"; // Correct import for Session type

const useAuthRedirect = (): { session: Session | null; status: string } => {
  const { data: session, status } = useSession();

  return { session, status };
};

export default useAuthRedirect;
