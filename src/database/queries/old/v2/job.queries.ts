import { $Enums, PrismaClient } from '@prisma/client';
import { JobPosting } from '../../../../shared/data/info.store.js';
import prisma from '../../../prisma_client.js';
import { AppliedJob } from '../../../../shared/types/types.js';

export async function insertJobInfo(
  jobPost: JobPosting
): Promise<number | undefined> {
  if (!jobPost?.companyName) {
    console.error('Job posting content or company name is not available.');
    return;
  }
  console.log(`JOB INFO - New job info received for ${jobPost.companyName} - ${jobPost.position}`)

  const created = await prisma.job_postings.upsert({
    where: {
      companyname_position: {
        companyname: jobPost.companyName,
        position: jobPost.position,
      },
    },
    update: {
      body: jobPost.body,
      url: jobPost.url,
      rawcompanyname: jobPost.rawCompanyName,
    },
    create: {
      body: jobPost.body,
      companyname: jobPost.companyName,
      rawcompanyname: jobPost.rawCompanyName,
      applicantcount: jobPost.applicantCount,
      jobdetails: jobPost.jobDetails,
      url: jobPost.url,
      position: jobPost.position,
      positionsummary: jobPost.positionSummary,
      yearsofexp: jobPost.yearsOfExp,
      educationlvl: jobPost.educationLvl,
      requirements: jobPost.requirements,
      nicetohaves: jobPost.niceToHaves,
      toolsandtech: jobPost.toolsAndTech,
      proglanguages: jobPost.progLanguages,
      frmwrksandlibs: jobPost.frmwrksAndLibs,
      databases: jobPost.databases,
      cloudplatforms: jobPost.cloudPlatforms,
      industrykeywords: jobPost.industryKeywords,
      softskills: jobPost.softSkills,
      certifications: jobPost.certifications,
      companyculture: jobPost.companyCulture,
      companyvalues: jobPost.companyValues,
      salary: jobPost.salary,
    },
  });

  return created.id;
}

export async function getApplicationList(): Promise<
  {
    id: number;
    company: string;
    position: string;
    url: string;
    userApplied: boolean;
    appliedOn: Date;
    status: $Enums.application_status;
    codeAssessmentCompleted: boolean;
    interviewCount: number;
    initialAppUpdateDate: Date;
  }[]
> {
  const results = await prisma.job_postings.findMany({
    select: {
      id: true,
      rawcompanyname: true,
      position: true,
      url: true,
      user_applied: true,
      applied_on: true,
      status: true,
      code_assessment_completed: true,
      interview_count: true,
      initial_application_update_date: true,
    },
    orderBy: { id: 'desc' },
  });

  return results.map((r) => ({
    id: r.id,
    company: r.rawcompanyname || '',
    position: r.position || '',
    url: r.url || '',
    userApplied: r.user_applied || false,
    appliedOn: r.applied_on ?? new Date(),
    status: r.status || 'Open',
    codeAssessmentCompleted: r.code_assessment_completed || false,
    interviewCount: r.interview_count || 0,
    initialAppUpdateDate: r.initial_application_update_date ?? new Date(),
  }));
}

export async function getJobInfo(jobPostId: number) {
  return prisma.job_info.findUnique({
    where: { job_posting_id: jobPostId },
  });
}

export async function getJobPost(id: number): Promise<JobPosting | null> {
  const row = await prisma.job_postings.findUnique({
    where: { id },
    select: {
      id: true,
      body: true,
      companyname: true,
      rawcompanyname: true,
      applicantcount: true,
      jobdetails: true,
      url: true,
      position: true,
      positionsummary: true,
      yearsofexp: true,
      educationlvl: true,
      requirements: true,
      nicetohaves: true,
      toolsandtech: true,
      proglanguages: true,
      frmwrksandlibs: true,
      databases: true,
      cloudplatforms: true,
      industrykeywords: true,
      softskills: true,
      certifications: true,
      companyculture: true,
      companyvalues: true,
      salary: true,
      user_applied: true,
      applied_on: true,
      status: true,
      code_assessment_completed: true,
      interview_count: true,
      initial_application_update_date: true,
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    body: row.body || '',
    companyName: row.companyname || '',
    rawCompanyName: row.rawcompanyname || '',
    applicantCount: row.applicantcount || '',
    jobDetails: row.jobdetails || '',
    url: row.url || '',
    position: row.position || '',
    positionSummary: row.positionsummary || '',
    yearsOfExp: row.yearsofexp || '',
    educationLvl: row.educationlvl || '',
    requirements: row.requirements || '',
    niceToHaves: row.nicetohaves || '',
    toolsAndTech: row.toolsandtech || '',
    progLanguages: row.proglanguages || '',
    frmwrksAndLibs: row.frmwrksandlibs || '',
    databases: row.databases || '',
    cloudPlatforms: row.cloudplatforms || '',
    industryKeywords: row.industrykeywords || '',
    softSkills: row.softskills || '',
    certifications: row.certifications || '',
    companyCulture: row.companyculture || '',
    companyValues: row.companyvalues || '',
    salary: row.salary || '',
    user_applied: row.user_applied || false,
    applied_on: row.applied_on || new Date(),
    status: row.status || '',
    code_assessment_completed: row.code_assessment_completed || false,
    interview_count: row.interview_count || 0,
    initial_application_update_date:
      row.initial_application_update_date || new Date(),
  };
}

export const setApplied = async (
  jobPostId: number,
  applied: boolean
): Promise<boolean> => {
  const item = await prisma.job_postings.update({
    where: { id: jobPostId },
    data: {
      user_applied: applied,
      applied_on: new Date(
        new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
      ),
    },
  });

  return item.user_applied ?? false;
};

export async function updateApplication(
  appliedJob: AppliedJob
): Promise<number | undefined> {
  const created = await prisma.job_postings.update({
    where: {
      id: Number(appliedJob.id),
    },
    data: {
      user_applied: true,
      status: appliedJob.status,
      code_assessment_completed: appliedJob.codeAssessmentCompleted,
      interview_count: appliedJob.interviewCount,
      initial_application_update_date: appliedJob.initialAppUpdateDate,
    },
  });

  return created.id;
}
