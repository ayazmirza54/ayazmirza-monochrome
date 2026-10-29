import { CodeXmlIcon, DatabaseIcon } from "lucide-react"

import type { Experience } from "@/features/portfolio/types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "wipro",
    companyName: "Wipro",
    companyWebsite: "https://www.wipro.com",
    location: "Greater Noida, India",
    positions: [
      {
        id: "2",
        title: "Data Engineer, Ab Initio Platform Team",
        employmentPeriod: {
          start: "11.2025",
        },
        icon: <DatabaseIcon />,
        description: `Client: Aldermore Bank, a UK-based financial services group.
- Manage the group data platform end-to-end as part of the Ab Initio platform team.
- Administer a hybrid infrastructure that integrates AWS (EC2, Redshift, CloudWatch) with Ab Initio Control Center, GDE, Metadata Hub Portal, and Authorization Gateway.
- Monitor Ab Initio jobs running on AWS, resolving pipeline failures proactively to meet banking SLAs.
- Handle platform administration, including OS user provisioning and Ab Initio license key installation and management.
- Author Redshift SQL scripts for release management, promoting data artifacts and configurations from UAT to Production.`,
        skills: [
          "Ab Initio",
          "Control Center",
          "GDE",
          "Metadata Hub",
          "Authorization Gateway",
          "Amazon EC2",
          "Amazon Redshift",
          "Amazon CloudWatch",
          "SQL",
        ],
        isExpanded: true,
      },
      {
        id: "1",
        title: "Senior Consultant",
        employmentPeriod: {
          start: "11.2019",
          end: "10.2025",
        },
        icon: <DatabaseIcon />,
        description: `Client: an Indonesian telecom operator.
- Developed and optimized Ab Initio ETL pipelines in GDE to process large-scale telecom data and deliver actionable business insights.
- Designed and scheduled Ab Initio graphs and jobs through Control Center, ensuring reliable orchestration and SLA adherence.
- Built SQL-based validation and reconciliation checks to ensure data accuracy and quality across the pipeline.
- Built Grafana dashboards for key telecom metrics, ETL job performance, and system health.
- Automated ETL job monitoring with Unix shell scripting, reducing manual intervention by 50% and improving operational efficiency by 30%.
- Automated Splunk log processing with shell scripts, significantly reducing manual log analysis.
- Implemented auto-restart and recovery scripts with Ansible and shell to minimize downtime for critical Ab Initio jobs.
- Acted as L2 ETL & DevOps engineer, mentoring L1 team members and contributing to HLD/LLD documentation and UAT.`,
        skills: [
          "Ab Initio",
          "GDE",
          "Control Center",
          "SQL",
          "Unix Shell",
          "Ansible",
          "Grafana",
          "Splunk",
          "Power BI",
        ],
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "cosmo-infosolutions",
    companyName: "Cosmo Infosolutions",
    location: "Lucknow, India",
    positions: [
      {
        id: "1",
        title: "Frontend Web Developer",
        employmentPeriod: {
          start: "06.2019",
          end: "10.2019",
        },
        icon: <CodeXmlIcon />,
        description: `- Built landing pages with HTML, CSS, JavaScript, and React, designed to capture attention and boost user interaction.
- Created responsive layouts that work well on desktop and mobile, with attention to layout, color, and typography.`,
        skills: ["HTML", "CSS", "JavaScript", "React", "Responsive Design"],
      },
    ],
  },
]
