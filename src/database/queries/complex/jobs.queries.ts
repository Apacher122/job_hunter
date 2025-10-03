import * as query from "../../index.js";

import { AppStatus } from "@database/schemas/ordo-meritum.schemas.js";
import {
  JobDescription,
} from "@features/application_tracking/models/job_description.js";
import { db } from "../../index.js";

export const getFullJobPosting = async (roleId: number, uid: string) => {
  const job = await db
    .selectFrom("roles")
    .innerJoin("companies", "roles.company_id", "companies.id")
    .innerJoin("job_requirements", "roles.id", "job_requirements.role_id")
    .select([
      "roles.job_title",
      "roles.description",
      "companies.company_name",
      "companies.company_culture",
      "companies.company_values",
      "job_requirements.requirements",
      "job_requirements.nice_to_haves",
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
      "job_requirements.applicant_count",
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
    job_title: jobPost.job_title,
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
    requirements: jobPost.skills_required,
    nice_to_haves: jobPost.skills_nice_to_haves,
    soft_skills: jobPost.soft_skills,
    certifications: jobPost.certifications,
  });
  } catch (error) {
    throw new Error('Could not create job: ' + error);
  }
};

export const getAllUserJobPostings = async (
  uid: string
) => {
  const results = await db
    .selectFrom('resumes')
    .innerJoin('roles', 'resumes.role_id', 'roles.id')
    .innerJoin('companies', 'roles.company_id', 'companies.id')
    .innerJoin('job_requirements', 'roles.id', 'job_requirements.role_id')
    .select([
      'roles.id as role_id',
      'roles.job_title as job_title',
      'companies.company_name as company_name',
      'companies.website as website',
      'roles.application_status as application_status',
      'roles.user_applied as user_applied',
      'job_requirements.interview_count as interview_count',
      'resumes.applied_on as initial_application_date',
    ])
    .where('firebase_uid', '=', uid)
    .execute()
  
    return results;
}

export const updateApplicationDetails = async (
  roleId: number,
  uid: string,
  updates: {
    status?: AppStatus;
    application_date?: Date;
  }
) => {
  return await db.transaction().execute(async (trx) => {
    const isAuthorized = (eb: any) =>
      eb.exists(
        eb
          .selectFrom("resumes")
          .where("resumes.role_id", "=", roleId)
          .where("resumes.firebase_uid", "=", uid)
      );

    
    if (updates.status) {
      await trx
        .updateTable("roles")
        .set({ application_status: updates.status })
        .where("id", "=", roleId)
        .where(isAuthorized) 
        .execute();
    }

    
    if (updates.application_date) {
      await trx
        .updateTable("resumes")
        .set({ applied_on: updates.application_date }) 
        .where("role_id", "=", roleId)
        .where("firebase_uid", "=", uid) 
        .execute();
    }

    return true;
  });
};


export const deleteJobPostById = async (roleId: number, uid: string) => {
    return await db.transaction().execute(async (trx) => {
        console.log(`Deleting application with role ID: ${roleId}`);
        const roleToDelete = await trx
            .selectFrom('roles')
            .selectAll()
            .innerJoin('resumes', 'resumes.role_id', 'roles.id')
            .where('roles.id', '=', roleId)
            .where('resumes.firebase_uid', '=', uid)
            .executeTakeFirst();

        if (!roleToDelete) {
            
            return null;
        }

        
        await trx
            .deleteFrom('job_requirements')
            .where('role_id', '=', roleId)
            .execute();

        
        await trx
            .deleteFrom('resumes')
            .where('role_id', '=', roleId)
            .where('firebase_uid', '=', uid) 
            .execute();

        
        await trx
            .deleteFrom('roles')
            .where('id', '=', roleId)
            .execute();
            
        
        return roleToDelete;
    });
};


export type FullJobPosting = Awaited<ReturnType<typeof getFullJobPosting>>;
