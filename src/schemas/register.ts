import { z } from "zod";

export const registerSchema = z.object({
  name: z.string(),
  username: z.string().min(3),
  password: z.string().min(8),
  confirmPass: z.string().min(8),
});
