import * as query from "../../index";

import {
  JobDescription,
} from "../../../features/application_tracking/models/job_description.models";
import { db } from "../../index";
import { updateCompany } from "../crud/company/company_info.crud";

export const getFullJobPosting = async (roleId: number, uid: string) => {
  const job = await db
    .selectFrom("roles")
    .innerJoin("companies", "roles.companyId", "companies.id")
    .innerJoin("job_requirements", "roles.id", "job_requirements.roleId")
    .select([
      "roles.title",
      "roles.description",
      "companies.name as company_name",
      "companies.culture",
      "companies.values",
      "job_requirements.educationLevel",
      "job_requirements.yearsOfExperience",
      "job_requirements.tools",
      "job_requirements.progLanguages",
      "job_requirements.frameworksAndLibs",
      "job_requirements.databases",
      "job_requirements.cloudPlatforms",
      "job_requirements.industryKeywords",
      "job_requirements.softSkills",
      "job_requirements.certifications",
      "roles.salaryRange",
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
