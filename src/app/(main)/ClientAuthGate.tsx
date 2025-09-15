"use client";

import { Authenticated, Unauthenticated } from "convex/react";

const ClientAuthGate = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) => {
  return (
    <>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>{fallback}</Unauthenticated>
    </>
  );
};
export default ClientAuthGate;
