import { openai } from "@ai-sdk/openai"
import { StreamingTextResponse, streamText } from "ai"
import { NextRequest } from "next/server"
import { ratelimit } from "./rate-limit"
import { system } from "./system-prompt"

export const maxDuration = 300

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    const ip = req.ip ?? "ip"
    const { success } = await ratelimit.limit(ip)
    if (!success) return new Response("Rate limited!", { status: 429 })
  }
  const { prompt }: { prompt: string } = await req.json()
  const result = await streamText({ model: openai("gpt-4o"), system, prompt })
  return new StreamingTextResponse(result.toAIStream())
}
