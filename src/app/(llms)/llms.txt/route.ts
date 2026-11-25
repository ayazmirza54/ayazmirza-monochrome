import { SITE_INFO } from "@/config/site"
import { getBlogPosts } from "@/features/doc/data/documents"
import { EXPERIENCES } from "@/features/portfolio/data/experiences"
import { PROJECTS } from "@/features/portfolio/data/projects"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

const allPosts = getBlogPosts()

const content = `# ${USER.displayName}

> ${USER.flipSentences[0]} ${USER.jobTitle} at ${USER.jobs[0].company}, ${USER.address}.

## Who I am

${USER.about.trim()}

## Work

${EXPERIENCES.flatMap((item) =>
  item.positions.map(
    (position) =>
      `- ${position.title}, ${item.companyName} (${position.employmentPeriod.start} - ${position.employmentPeriod.end ?? "Present"})${item.companyWebsite ? `: ${item.companyWebsite}` : ""}`
  )
).join("\n")}

## Projects

${PROJECTS.map((item) => `- [${item.title}](${item.link})${item.description ? `: ${item.description.split("\n")[0]}` : ""}`).join("\n")}

## Contact

${SOCIAL_LINKS.map((item) => `- ${item.title}: ${item.href}`).join("\n")}
- Website: ${SITE_INFO.url}
- Resume (PDF): ${SITE_INFO.url}/AyazMirzaResume.pdf

## More

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
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
