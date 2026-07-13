import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { hasAuth } from "@/lib/config";

// Clerk is mounted only on the surfaces that need a session: this one, and
// /admin. The rest of the site is read-only history and stays statically
// prerendered, with no auth on the request path.
export default function ContributeLayout({ children }: { children: React.ReactNode }) {
  if (!hasAuth) return <>{children}</>;
  return (
    <ClerkProvider dynamic>
      {children}
      <Toaster position="top-center" richColors />
    </ClerkProvider>
  );
}
