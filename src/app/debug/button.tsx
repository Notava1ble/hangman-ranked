"use client";

import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ActionButton = ({ func }: { func?: any }) => {
  if (!func) {
    return (
      <Button
        onClick={() => {
          throw new Error("This is a client-side error for testing purposes.");
        }}
      >
        ThrowClientError
      </Button>
    );
  }
  return <Button onClick={() => func()}>ThrowServerError</Button>;
};
export default ActionButton;
