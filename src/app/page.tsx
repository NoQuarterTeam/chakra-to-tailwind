"use client"

import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/lib/hooks/use-clipboard"
import { useCompletion } from "ai/react"
import { Loader2, Stars } from "lucide-react"
import Link from "next/link"
import { Highlight, themes } from "prism-react-renderer"
import * as React from "react"
import { toast } from "sonner"

export const maxDuration = 300

export default function Page() {
  const [state, setState] = React.useState<"init" | "editing" | "complete" | "error">("init")

  const { completion, stop, isLoading, input, handleInputChange, handleSubmit } = useCompletion({
    api: "/converter",
    onError: () => {
      setState("init")
      toast.error("Conversion failed")
    },
    onFinish: () => {
      setState("complete")
      toast.success("Conversion complete")
    },
  })

  const [_, copy] = useCopyToClipboard()

  return (
    <form onSubmit={handleSubmit} className="h-screen">
      <div className="flex justify-between items-center w-full border-b gap-4 h-nav px-6">
        <h1 className="text-lg">Chakra to Tailwind</h1>
        <Link href="https://www.noquarter.co" target="_blank" rel="noreferrer noopener" className="hover:underline">
          By No Quarter
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y border-b md:divide-x md:divide-y-0 bg-background divide-border h-12">
        <div className="pl-6 pr-2 flex items-center justify-between">
          <p className="text-sm opacity-70">Original</p>
          <div className="flex items-center space-x-2">
            {!!input && (
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => {
                  setState((s) => (s === "editing" ? "init" : "editing"))
                }}
                size="sm"
              >
                {state === "editing" ? "Done" : "Edit"}
              </Button>
            )}

            {isLoading ? (
              <Button
                className="w-[100px]"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  stop()
                }}
                type="button"
              >
                Cancel
                <Loader2 size={16} className="animate-spin ml-2" />
              </Button>
            ) : (
              <Button className="w-[100px]" size="sm" type="submit" disabled={state === "editing"}>
                Convert
                <Stars size={12} className="ml-2" />
              </Button>
            )}
          </div>
        </div>
        <div className="px-6 flex items-center justify-between">
          <p className="text-sm opacity-70">Generated</p>
          {state === "complete" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                copy(completion).then(() => toast.success("Copied!"))
              }}
            >
              Copy
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-x md:divide-y-0 bg-muted divide-border h-[calc(100svh-theme(spacing.nav)-theme(spacing.12))]">
        <div className="relative h-full flex flex-col overflow-scroll">
          {input && state !== "editing" ? (
            <Code code={input} />
          ) : (
            <textarea
              name="prompt"
              // biome-ignore lint/a11y/noAutofocus: we need it
              autoFocus
              id="prompt"
              placeholder="Paste code snippet here"
              value={input}
              className="bg-transparent text-sm w-full flex-1 outline-0 border-none focus:ring-0 p-6 focus:border-0 resize-none"
              onChange={handleInputChange}
            />
          )}
        </div>
        <div className="h-full flex flex-col overflow-scroll">
          <Code code={completion || ""} />
        </div>
      </div>
    </form>
  )
}

interface Props {
  code: string
}

function Code(props: Props) {
  return (
    <Highlight theme={themes.oneLight} code={props.code} language="tsx">
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className="flex-1 text-sm p-6">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
