import { SITE_INFO } from "@/config/site"
import { getBlogPosts } from "@/features/doc/data/documents"

const allPosts = getBlogPosts()

const content = `# ayazmirza.dev

> Portfolio of Ayaz Mirza, a Data Engineer building reliable ETL pipelines on Ab Initio, AWS and GCP.

- [About](${SITE_INFO.url}/about.md): A quick intro to me, my tech stack, and how to connect.
- [Experience](${SITE_INFO.url}/experience.md): Highlights from my career and key roles I've taken on.
- [Education](${SITE_INFO.url}/education.md): Where I studied.
- [Projects](${SITE_INFO.url}/projects.md): Selected projects that show my skills and creativity.
- [Recognition](${SITE_INFO.url}/recognition.md): Awards and certifications.
- [Blog](${SITE_INFO.url}/blog.md): Every blog post, newest first, with publish dates.

## Blog

${allPosts.map((item) => `- [${item.metadata.title}](${item.metadata.externalUrl ?? `${SITE_INFO.url}/blog/${item.slug}.md`}): ${item.metadata.description}`).join("\n")}
`

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
