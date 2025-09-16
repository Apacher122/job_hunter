import { JobPosting } from "../data/info.store";
import { AppliedJob } from "../types/types";

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

export function mapAppliedJobToBackend(applied: AppliedJob, existing?: JobPosting) {
  return {
    ...existing,

    user_applied: applied.userApplied,
    applied_on: applied.appliedOn,
    status: applied.status,
    code_assessment_completed: applied.codeAssessmentCompleted,
    interview_count: applied.interviewCount,
    initial_application_update_date: applied.initialAppUpdateDate,
  } as JobPosting;
}
