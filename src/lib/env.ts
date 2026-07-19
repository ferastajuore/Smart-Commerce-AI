import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  ENCRYPTION_KEY: z.string().min(1),
  FACEBOOK_APP_ID: z.string().min(1),
  FACEBOOK_APP_SECRET: z.string().min(1),
  INTEGRATION_CREDENTIAL_SALT: z.string().min(1),
  SMS_PROVIDER_API_KEY: z.string().min(1).optional(),
  SMS_PROVIDER_API_SECRET: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

export const env = validateEnv();
