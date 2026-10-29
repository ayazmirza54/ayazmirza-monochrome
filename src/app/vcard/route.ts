import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"
import { decodeEmail, decodePhoneNumber } from "@/utils/string"
import sharp from "sharp"
import VCard from "vcard-creator"

import { USER } from "@/features/portfolio/data/user"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function GET() {
  const card = new VCard()

  card
    .addName(USER.lastName, USER.firstName)
    .addPhoneNumber(decodePhoneNumber(USER.phoneNumberB64))
    .addAddress(USER.address)
    .addEmail(decodeEmail(USER.emailB64))
    .addURL(USER.website)

  const photo = await getVCardPhoto(USER.avatar)
  if (photo) {
    card.addPhoto(photo.image, photo.mime)
  }

  if (USER.jobs.length > 0) {
    const company = USER.jobs[0]
    card.addCompany(company.company).addJobtitle(company.title)
  }

  return new NextResponse(card.toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/x-vcard",
      "Content-Disposition": `attachment; filename=${USER.username}-vcard.vcf`,
    },
  })
}

async function getVCardPhoto(src: string) {
  try {
    const buffer = await readImage(src)
    if (!buffer || buffer.length === 0) {
      return null
    }

    const jpegBuffer = await convertImageToJpeg(buffer)
    const image = jpegBuffer.toString("base64")

    return {
      image,
      mime: "jpeg",
    }
  } catch {
    return null
  }
}

// Root-relative paths live in `public/`, which a static build cannot fetch
// from the site itself.
async function readImage(src: string) {
  if (src.startsWith("/")) {
    return readFile(path.join(process.cwd(), "public", src))
  }

  const res = await fetch(src)
  const contentType = res.headers.get("Content-Type") || ""
  if (!res.ok || !contentType.startsWith("image/")) {
    return null
  }

  return Buffer.from(await res.arrayBuffer())
}

async function convertImageToJpeg(imageBuffer: Buffer): Promise<Buffer> {
  try {
    const jpegBuffer = await sharp(imageBuffer)
      .jpeg({
        quality: 90,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer()

    return jpegBuffer
  } catch (error) {
    console.error("Error converting image to JPEG:", error)
    throw error
  }
}
