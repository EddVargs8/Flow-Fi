"use client";

import { SessionProvider } from "next-auth/react";

export default function ClientProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
