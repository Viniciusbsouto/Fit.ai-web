import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Next.js only inlines public variables accessed directly through process.env.
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    credentials: "include",
  },
});
