import { action } from "./_generated/server";

export const getServerTime = action({
  args: {},
  handler: async () => {
    return Date.now();
  },
});