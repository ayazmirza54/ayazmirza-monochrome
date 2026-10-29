# ayazmirza54.in

Portfolio of Ayaz Mirza, a Data Engineer building reliable ETL pipelines on Ab Initio, AWS and GCP.

→ Live site: [ayazmirza54.in](https://www.ayazmirza54.in)

## Overview

### Stack

- Next.js 16
- Tailwind CSS v4
- shadcn/ui

### Sections

- Profile, contact details, and a GitHub contribution graph
- Tech stack, experience, education, and projects
- Awards and Google Cloud certifications
- Blog posts cross-posted from [DEV](https://dev.to/ayazmirza54)

## Editing the content

All personal details live in `src/features/portfolio/data/`:

| File                | Content                                          |
| ------------------- | ------------------------------------------------ |
| `user.ts`           | Name, bio, about, contact, avatar, location      |
| `social-links.ts`   | X, GitHub, LinkedIn, DEV                         |
| `experiences.tsx`   | Work history                                     |
| `education.ts`      | Education                                        |
| `projects.tsx`      | Projects                                         |
| `tech-stack.tsx`    | Tech stack                                       |
| `certifications.ts` | Certifications (add `issueDate`/`credentialURL`) |
| `awards.tsx`        | Awards                                           |
| `numbers.ts`        | "At a glance" stats                              |

Blog posts are MDX files in `src/features/doc/content/blog/`. Set `externalUrl` in the frontmatter to link a card straight to a post published elsewhere.

The "AM" mark, the wordmark, and the footer logotype are pixel art defined as text grids in `src/components/site-mark.tsx` and `src/lib/pixel-art.ts`. The isometric mark in the header is generated from the same grid.

## Development

Please refer to the [Development Guide](./DEVELOPMENT.md) for more details.

## Credits

Forked from [chanhdai.com](https://github.com/ncdai/chanhdai.com) by Nguyen Chanh Dai, released under the [MIT license](./LICENSE). The original name and brand assets are excluded from that license (see [TRADEMARK.md](./TRADEMARK.md)) and have been replaced here.
