import { EducationInfoType } from "@shared/models/user_info.js";
import { SafeParseSuccess } from "zod";

type JobPost = {
  job_title: string;
  description?: string;
  salary_range?: string;
  company_name: string;
  company_culture?: string;
  company_values?: string;
  years_of_exp?: string;
  education_level?: string;
  tools?: string[];
  programming_languages?: string[];
  frameworks_and_libraries?: string[];
  databases?: string[];
  cloud_technologies?: string[];
  industry_keywords?: string[];
  soft_skills?: string[];
  certifications?: string[];
  requirements?: string[];
  nice_to_haves?: string[];
  applicant_count?: number;
};
export const prettyJobPost = (jobPost: SafeParseSuccess<JobPost>) => {
  const job = jobPost.data;
  const formatArray = (arr?: string[]) =>
    arr && arr.length > 0 ? arr.join(", ") : "None";

  return `
Job Title: ${job.job_title}
Company: ${job.company_name}
Salary Range: ${job.salary_range ?? "Not specified"}
Years of Experience: ${job.years_of_exp ?? "Not specified"}
Education Level: ${job.education_level ?? "Not specified"}

Description:
${job.description ?? "No description provided"}

Company Culture:
${job.company_culture ?? "Not specified"}

Company Values:
${job.company_values ?? "Not specified"}

Required Tools: ${formatArray(job.tools)}
Programming Languages: ${formatArray(job.programming_languages)}
Frameworks & Libraries: ${formatArray(job.frameworks_and_libraries)}
Databases: ${formatArray(job.databases)}
Cloud Technologies: ${formatArray(job.cloud_technologies)}
Industry Keywords: ${formatArray(job.industry_keywords)}
Soft Skills: ${formatArray(job.soft_skills)}
Certifications: ${formatArray(job.certifications)}

Requirements:
${formatArray(job.requirements)}

Nice to Have:
${formatArray(job.nice_to_haves)}

Applicant Count: ${job.applicant_count ?? 0}
  `.trim();
};

type EducationData = {
  school: string;
  degree: string;
  start_end: string;
  location?: string;
  coursework?: string;
  undergraduate_coursework?: string;
  graduate_coursework?: string;
  education_summary?: string;
};

export const prettyEducationInfo = (
  data: EducationInfoType
) => {

  const formatField = (label: string, value?: string) =>
    `${label}: ${value ?? "Not specified"}`;

  return `
School: ${data.school}
Degree: ${data.degree}
Duration: ${data.start_end}
Location: ${data.location ?? "Not specified"}

Coursework: ${data.coursework ?? "None"}
Undergraduate Coursework: ${data.undergraduate_coursework ?? "None"}
Graduate Coursework: ${data.graduate_coursework ?? "None"}

Summary:
${data.education_summary ?? "No summary provided"}
  `.trim();
};
