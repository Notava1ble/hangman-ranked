"use server";

import { revalidatePath } from "next/cache";

export const serverRevalidatePath = (path: string) => {
  revalidatePath(path);
};
