// Thanks @fumadocs

"use client"

import { useEffect, useMemo, useReducer } from "react"
import { IconCheck, IconCopy, IconX } from "@tabler/icons-react"
import { ChevronDownIcon } from "lucide-react"

import { SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { useUiTiks } from "@/hooks/use-ui-tiks"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ClaudeIcon,
  CursorIcon,
  GitHubIcon,
  GrokIcon,
  MarkdownIcon,
  OpenAIIcon,
  SciraIcon,
  V0Icon,
} from "@/components/icons"
import { CopyStateIcon } from "@/registry/components/copy-button"
import {
  PAGE_COPY_RESET_DELAY_MS,
  PAGE_COPY_SLOW_DELAY_MS,
  pageCopyIconState,
  pageCopyTransition,
} from "@/features/doc/lib/page-copy-machine"

const cache = new Map<string, string>()

export function LLMCopyButton({ markdownUrl }: { markdownUrl: string }) {
  const [phase, dispatch] = useReducer(pageCopyTransition, "idle")

  const { success, error } = useUiTiks()

  // Timers live in effects, keyed on the phase, so they cancel on unmount and
  // can never fire into a phase they were not meant for.
  useEffect(() => {
    if (phase === "pending") {
      const timer = setTimeout(
        () => dispatch({ type: "slow" }),
        PAGE_COPY_SLOW_DELAY_MS
      )
      return () => clearTimeout(timer)
    }

    if (phase === "done" || phase === "error") {
      const timer = setTimeout(
        () => dispatch({ type: "reset" }),
        PAGE_COPY_RESET_DELAY_MS
      )
      return () => clearTimeout(timer)
    }
  }, [phase])

  const handleCopy = async () => {
    // Clicks are discrete events, so React has re-rendered with the new phase
    // before the next click handler runs.
    if (phase !== "idle") return

    dispatch({ type: "start" })

    try {
      const cached = cache.get(markdownUrl)
      if (cached) {
        await navigator.clipboard.writeText(cached)
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": fetch(markdownUrl)
              .then((res) => res.text())
              .then((content) => {
                cache.set(markdownUrl, content)
                return content
              }),
          }),
        ])
      }
      success()
      dispatch({ type: "succeed" })
    } catch {
      error()
      dispatch({ type: "fail" })
    }
  }

  const isLoading = phase === "loading"

  return (
    <Button
      className="h-7 gap-1.5 border-none px-2 text-[0.8125rem] active:scale-none"
      variant="secondary"
      size="sm"
      aria-busy={isLoading}
      disabled={isLoading}
      onClick={handleCopy}
    >
      <CopyStateIcon
        state={pageCopyIconState(phase)}
        idleIcon={<IconCopy />}
        doneIcon={<IconCheck />}
        errorIcon={<IconX />}
      />
      <span className="max-[28rem]:hidden">Copy page</span>
    </Button>
  )
}

function getPrompt(url: string, isComponent?: boolean) {
  if (isComponent) {
    return `I'm looking at this component documentation: ${url}
I want to use it in a React (TypeScript) project.
Help me understand how to use it step-by-step, including explaining key concepts, showing practical examples with TypeScript code, and pointing out common pitfalls.
Be ready to answer follow-up questions and help debug issues based on the documentation.`
  }

  return `Read ${url}, I want to ask questions about it.`
}

export function ViewOptions({
  markdownUrl,
  isComponent = false,
}: {
  markdownUrl: string
  isComponent?: boolean
}) {
  const items = useMemo(() => {
    const fullMarkdownUrl =
      typeof window !== "undefined"
        ? new URL(markdownUrl, window.location.origin).toString()
        : markdownUrl

    const q = getPrompt(fullMarkdownUrl, isComponent)

    const _items = [
      {
        title: "View as Markdown",
        href: fullMarkdownUrl,
        icon: MarkdownIcon,
      },
      {
        title: "Open in GitHub",
        // Source files remain .mdx even though the public URL uses .md
        href: `${SOURCE_CODE_GITHUB_URL}/blob/main/src/features/doc/content/${markdownUrl.replace(/^\//, "").replace(/\.md$/, ".mdx")}`,
        icon: GitHubIcon,
      },
      {
        title: "Open in ChatGPT",
        href: `https://chatgpt.com/?${new URLSearchParams({
          hints: "search",
          q,
        })}`,
        icon: OpenAIIcon,
      },
      {
        title: "Open in Claude",
        href: `https://claude.ai/new?${new URLSearchParams({
          q,
        })}`,
        icon: ClaudeIcon,
      },
      {
        title: "Open in Cursor",
        href: `https://cursor.com/link/prompt?${new URLSearchParams({
          text: q,
        })}`,
        icon: CursorIcon,
      },
      {
        title: "Open in Grok",
        href: `https://grok.com/?${new URLSearchParams({
          q,
        })}`,
        icon: GrokIcon,
      },
      {
        title: "Open in Scira AI",
        href: `https://scira.ai/?${new URLSearchParams({
          q,
        })}`,
        icon: SciraIcon,
      },
    ]

    if (isComponent) {
      _items.splice(2, 0, {
        title: "Open in v0",
        href: `https://v0.app/?${new URLSearchParams({
          q,
        })}`,
        icon: V0Icon,
      })
    }

    return _items
  }, [markdownUrl, isComponent])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="size-7 border-none active:scale-none"
            variant="secondary"
            size="icon-sm"
            aria-label="View Options"
          />
        }
      >
        <ChevronDownIcon className="mt-0.5 size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-fit"
        align="start"
        alignOffset={-6}
        collisionPadding={16}
        finalFocus={false}
      >
        {items.map(({ title, href, icon: Icon }) => (
          <DropdownMenuItem
            key={href}
            render={<a href={href} rel="noopener" target="_blank" />}
          >
            <Icon />
            {title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LLMCopyButtonWithViewOptions({
  markdownUrl,
  isComponent = false,
}: {
  markdownUrl: string
  isComponent?: boolean
}) {
  return (
    <ButtonGroup>
      <LLMCopyButton markdownUrl={markdownUrl} />
      <ButtonGroupSeparator className="border-y-4 border-secondary dark:bg-white/20 data-vertical:my-0" />
      <ViewOptions markdownUrl={markdownUrl} isComponent={isComponent} />
    </ButtonGroup>
  )
}
