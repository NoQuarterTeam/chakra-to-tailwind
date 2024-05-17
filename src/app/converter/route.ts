import { openai } from "@ai-sdk/openai"
import { StreamingTextResponse, streamText } from "ai"
import { system } from "./system-prompt"

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json()

  const result = await streamText({ model: openai("gpt-4o"), system, prompt })

  return new StreamingTextResponse(result.toAIStream())
}
