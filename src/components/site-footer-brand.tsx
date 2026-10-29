import { NameIsometric } from "@/features/portfolio/components/site-mark-isometric"

export function SiteFooterInteractiveLogotype() {
  return (
    <div className="screen-line-bottom after:z-1 after:bg-foreground/15">
      <div className="mx-auto border-x border-x-line p-4 group-has-data-[slot=layout-wide]/layout:container sm:px-8 sm:py-10 md:max-w-3xl">
        <NameIsometric />
        <span className="sr-only">Ayaz Mirza</span>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 hidden h-px w-[50%] max-w-full -translate-x-1/2 dark:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0) 0%, rgba(228, 228, 231, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
        aria-hidden
      />
    </div>
  )
}
