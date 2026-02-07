"use client";

import { SessionProvider, useSession } from "next-auth/react";
import Loading from "./Loading";

function AuthLoader({ children }) {
  const { status } = useSession();

  if (status === "loading") {
    // When NextAuth is restoring session
    return <Loading />;
  }

  return children;
}

export default function SessionProviderWrapper({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
