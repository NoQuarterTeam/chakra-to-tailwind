"use client"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/lib/hooks/use-clipboard"
import { useCompletion } from "ai/react"
import { Loader2, Stars } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Highlight, themes } from "prism-react-renderer"
import * as React from "react"
import { toast } from "sonner"
import { ERROR_CODES } from "./converter/error-codes"

export const maxDuration = 300

export default function Page() {
  const [state, setState] = React.useState<"editing" | "ready" | "complete">("editing")

  const { completion, stop, isLoading, setCompletion, input, handleInputChange, handleSubmit } = useCompletion({
    api: "/converter",
    onError: (error) => {
      setState("ready")
      toast.error("Conversion failed", { description: error.message })
    },
    onFinish: (_, comp) => {
      setState("complete")
      if (ERROR_CODES.includes(comp)) return toast.error("Conversion failed", { description: comp })
      toast.success("Conversion complete", {
        action: {
          label: "Copy",
          onClick: () =>
            copy(comp).then(() => {
              toast.success("Copied!")
            }),
        },
      })
    },
  })

  const [_, copy] = useCopyToClipboard()
  return (
    <form onSubmit={handleSubmit} className="h-screen">
      <div className="flex justify-between items-center w-full border-b gap-4 h-nav px-6">
        <div className="space-x-2 flex items-center">
          <h1 className="font-semibold">Chakra to Tailwind</h1>
          <Link href="https://www.noquarter.co" target="_blank" rel="noreferrer noopener" className="hover:underline text-sm">
            By No Quarter
          </Link>
        </div>

        <ModeToggle />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y border-b md:divide-x md:divide-y-0 bg-background divide-border h-12">
        <div className="pl-6 pr-2 flex items-center justify-between">
          <p className="text-sm">Input</p>
          <div className="flex items-center space-x-2">
            {!!input && (
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => {
                  setState((s) => (s === "editing" ? "ready" : "editing"))
                }}
                size="sm"
              >
                {state === "editing" ? "Done" : "Edit"}
              </Button>
            )}

            {isLoading ? (
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  stop()
                }}
                type="button"
              >
                <span className="mr-2 w-[64px]">Cancel</span>

                <Loader2 size={14} className="animate-spin" />
              </Button>
            ) : (
              <Button size="sm" type="submit" disabled={state === "editing" || !input || ERROR_CODES.includes(completion)}>
                <span className="mr-2 w-[64px]">Convert</span>
                <Stars size={14} />
              </Button>
            )}
          </div>
        </div>
        <div className="px-6 flex items-center justify-between">
          <p className="text-sm">Generated</p>
          {state === "complete" && !ERROR_CODES.includes(completion) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                copy(completion)
                  .then(() => toast.success("Copied!"))
                  .catch(() => toast.error("Failed to copy"))
              }}
            >
              Copy
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-x md:divide-y-0 bg-muted divide-border h-[calc(100svh-theme(spacing.nav)-theme(spacing.12))]">
        <div className="relative h-full flex flex-col overflow-scroll">
          {state === "editing" ? (
            <textarea
              name="prompt"
              // biome-ignore lint/a11y/noAutofocus: we need it
              autoFocus
              id="prompt"
              placeholder="Paste code snippet here"
              value={input}
              onPaste={(e) => {
                e.persist()
                setTimeout(() => {
                  // hack to auto move to ready
                  setState("ready")
                }, 10)
              }}
              className="bg-transparent text-sm w-full flex-1 outline-0 border-none focus:ring-0 p-6 focus:border-0 resize-none"
              onChange={(e) => {
                handleInputChange(e)
                if (ERROR_CODES.includes(completion)) setCompletion("")
              }}
            />
          ) : (
            <Code code={input} />
          )}
        </div>
        <div className="h-full flex flex-col overflow-scroll">
          {ERROR_CODES.includes(completion) ? null : <Code code={completion || ""} />}
        </div>
      </div>
    </form>
  )
}

interface Props {
  code: string
}

function Code(props: Props) {
  const { theme } = useTheme()
  return (
    <Highlight theme={theme === "dark" ? themes.oneDark : themes.oneLight} code={props.code} language="tsx">
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
