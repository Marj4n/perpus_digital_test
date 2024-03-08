import { z } from "zod";

export const favoriteCreationSchema = z.object({
  userId: z.number(),
  bookId: z.number(),
});
