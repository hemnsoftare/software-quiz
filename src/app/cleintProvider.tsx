"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export const queryClient = new QueryClient();

interface ClientProviderProps {
  children: ReactNode;
}
export default function ClientProvider({ children }: ClientProviderProps) {
  return (
    <>
      <>
        <QueryClientProvider client={queryClient}>
          <>{children}</>
        </QueryClientProvider>
      </>
    </>
  );
}
