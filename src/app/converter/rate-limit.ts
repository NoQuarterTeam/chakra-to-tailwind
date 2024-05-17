import { Ratelimit } from "@upstash/ratelimit" // for deno: see above
import { Redis } from "@upstash/redis" // see below for cloudflare and fastly adapters

// Create a new ratelimiter, that allows 10 requests per 60 seconds
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
})
