"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "~/lib/auth-client";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={(...args: Parameters<typeof router.push>) =>
        router.push(...args)
      }
      replace={(...args: Parameters<typeof router.replace>) =>
        router.replace(...args)
      }
      onSessionChange={async () => {
        router.refresh();

        try {
          const session = await authClient.getSession();
          if (session.data?.user && typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            if (currentPath.startsWith("/auth/")) {
              router.push("/dashboard");
            }
          }
        } catch (error) {
          console.log("Session check failed:", error);
        }
      }}
      Link={Link}
    >
      {children}
    </AuthUIProvider>
  );
}
