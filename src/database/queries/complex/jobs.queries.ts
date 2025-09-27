import * as query from "../../index";

import {
  JobDescription,
} from "../../../features/application_tracking/models/job_description.models";
import { db } from "../../index";
import { updateCompany } from "../crud/company/company_info.crud";

export const getFullJobPosting = async (roleId: number, uid: string) => {
  const job = await db
    .selectFrom("roles")
    .innerJoin("companies", "roles.company_id", "companies.id")
    .innerJoin("job_requirements", "roles.id", "job_requirements.role_id")
    .select([
      "roles.title",
      "roles.description",
      "companies.company_name",
      "companies.company_culture",
      "companies.company_values",
      "job_requirements.education_level",
      "job_requirements.years_of_exp",
      "job_requirements.tools",
      "job_requirements.programming_languages",
      "job_requirements.frameworks_and_libraries",
      "job_requirements.databases",
      "job_requirements.cloud_platforms",
      "job_requirements.industry_keywords",
      "job_requirements.soft_skills",
      "job_requirements.certifications",
      "roles.salary_range",
    ])
    .where("roles.id", "=", roleId)
    .executeTakeFirst();

  if (!job) {
    throw new Error("Job not found.");
  }

  return job;
};

export const insertFullJobPosting = async (
  jobRawText: string,
  jobPost: JobDescription,
  firebaseUid: string
) => {
  const companyId = await query.createCompany({
    name: jobPost.company_name,
    culture: jobPost.company_culture,
    values: jobPost.company_values,
  });
  
  const roleId = await query.createRole({
    title: jobPost.job_title,
    description: jobRawText,
    companyId: Number(companyId),
    salaryRange: jobPost.salary_range,
  });

  await query.createResume({
    firebaseUid: firebaseUid,
    roleId: Number(roleId),
  });

  return await query.createJobRequirements({
    roleId: Number(roleId),
    educationLevel: jobPost.education_level,
    yearsOfExperience: jobPost.years_of_experience_required,
    tools: jobPost.tools_and_technologies,
    progLanguages: jobPost.programming_languages,
    frameworksAndLibs: jobPost.frameworks_and_libraries,
    databases: jobPost.databases,
    cloudPlatforms: jobPost.cloud_platforms,
    industryKeywords: jobPost.industry_keywords,
    softSkills: jobPost.soft_skills,
    certifications: jobPost.certifications,
  });
};
