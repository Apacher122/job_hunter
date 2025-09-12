import { JobPosting } from "../data/info.store";

export const jobPostingMapping: Record<
  keyof Pick<JobPosting,
    | "yearsOfExp"
    | "educationLvl"
    | "requirements"
    | "niceToHaves"
    | "toolsAndTech"
    | "progLanguages"
    | "frmwrksAndLibs"
    | "databases"
    | "cloudPlatforms"
    | "industryKeywords"
    | "softSkills"
    | "certifications"
    | "companyCulture"
    | "companyValues"
    | "salary"
  >,
  string
> = {
  yearsOfExp: "years_of_experience_required",
  educationLvl: "education_level",
  requirements: "skills_required",
  niceToHaves: "skills_nice_to_haves",
  toolsAndTech: "tools_and_technologies",
  progLanguages: "programming_languages",
  frmwrksAndLibs: "frameworks_and_libraries",
  databases: "databases",
  cloudPlatforms: "cloud_platforms",
  industryKeywords: "industry_keywords",
  softSkills: "soft_skills",
  certifications: "certifications",
  companyCulture: "company_culture",
  companyValues: "company_values",
  salary: "salary_range",
};