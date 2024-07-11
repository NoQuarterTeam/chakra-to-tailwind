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
  const { prompt, info } = (await req.json()) as { prompt: string; info: string | undefined }
  const result = await streamText({ model: openai("gpt-4o"), system: system(info), prompt })
  return new StreamingTextResponse(result.toAIStream())
}
