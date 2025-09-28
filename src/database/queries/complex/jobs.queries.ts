import * as query from "../../index";

import {
  JobDescription,
} from "../../../features/application_tracking/models/job_description";
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
      "job_requirements.cloud_technologies",
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
  uid: string
) => {
  try {
  const company = await query.upsertCompany({
    company_name: jobPost.company_name,
    company_culture: jobPost.company_culture,
    company_values: jobPost.company_values,
    website: jobPost.website,
  });
  
  const role = await query.createRole({
    title: jobPost.job_title,
    description: jobRawText,
    company_id: Number(company?.id),
    salary_range: jobPost.salary_range,
  });

  await query.createResume({
    role_id: Number(role?.id),
    firebase_uid: uid,
  });

  return await query.createJobRequirements({
    role_id: Number(role?.id),
    education_level: jobPost.education_level,
    applicant_count: jobPost.applicant_count,
    years_of_exp: jobPost.years_of_exp,
    tools: jobPost.tools_and_technologies,
    programming_languages: jobPost.programming_languages,
    frameworks_and_libraries: jobPost.frameworks_and_libraries,
    databases: jobPost.databases,
    cloud_technologies: jobPost.cloud_technologies,
    industry_keywords: jobPost.industry_keywords,
    soft_skills: jobPost.soft_skills,
    certifications: jobPost.certifications,
  });
  } catch (error) {
    throw new Error('Could not create job: ' + error);
  }
};
