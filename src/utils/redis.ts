import { Redis } from "@upstash/redis";

function getEnv(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = import.meta.env[key] || process.env[key];
    if (value) return value;
  }
  return undefined;
}

export const redis = new Redis({
  url: getEnv(["KV_REST_API_URL", "KV_REST_URL", "UPSTASH_REDIS_REST_URL"])!,
  token: getEnv([
    "KV_REST_API_TOKEN",
    "KV_REST_TOKEN",
    "UPSTASH_REDIS_REST_TOKEN",
  ])!,
});
