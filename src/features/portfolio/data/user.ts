import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Ayaz",
  lastName: "Mirza",
  displayName: "Ayaz Mirza",
  username: "ayazmirza54",
  bio: "Data Engineer building reliable ETL pipelines on Ab Initio, AWS and GCP.",
  flipSentences: [
    "Data Engineer building reliable ETL pipelines.",
    "Ab Initio · AWS · GCP.",
    "Google Cloud Associate Cloud Engineer.",
    "Shipping AI side projects on weekends.",
  ],
  address: "Lucknow, India",
  phoneNumberB64: "KzkxOTg4OTAxNzc3NA==", // E.164 format, base64 encoded (https://t.io.vn/base64-string-converter)
  emailB64: "YXlhem1pcnphNTRAZ21haWwuY29t", // base64 encoded
  website: "https://ayazmirza.dev",
  jobTitle: "Data Engineer",
  jobs: [
    {
      title: "Data Engineer",
      company: "Wipro",
      website: "https://www.wipro.com",
      experienceId: "wipro",
    },
  ],
  about: `- Data Engineer with 6+ years of experience designing, building, and optimizing high-volume ETL pipelines using Ab Initio and SQL.
- Currently on the Ab Initio platform team for [Aldermore Bank](https://www.aldermore.co.uk) (UK) at Wipro, running a hybrid platform on AWS (EC2, Redshift, CloudWatch).
- Skilled in automation with Shell scripting and Ansible, monitoring with Grafana, and data visualization with Power BI.
- Google Cloud certified Associate Cloud Engineer; I build AI-powered side projects with Gemini and Claude on weekends.
`,
  avatar: "/images/avatar.webp",
  ogImage: "/images/og-image.png",
  timeZone: "Asia/Kolkata",
  keywords: [
    "ayazmirza54",
    "ayaz mirza",
    "ayaz",
    "data engineer",
    "ab initio",
    "etl developer",
    "aws",
    "gcp",
    "lucknow",
  ],
  dateCreated: "2026-10-29", // YYYY-MM-DD
}
