import { infoStore, JobPosting } from '../../../shared/data/info.store';
import fs from 'fs';
import { updateApplication, insertJobInfo, setApplied } from '../../../database/queries/v2/job.queries';
import paths from '../../../shared/constants/paths';
import { sanitizeText } from '../../../shared/utils/formatters/string.formatter';
import { getOpenAIResponse } from '../../../shared/libs/open_ai/openai';
import { JobDescriptionSchema } from '../models/job_description.models';
import { loadTemplate } from '../../../shared/utils/templates/template.loader';
import { jobPostingMapping, mapAppliedJobToBackend } from '../../../shared/mappers/jobPost.mappers';
import { JobDescriptionMock } from '../models/job_description.mock';
import { getJobInfo } from '../../../database/queries/v2/job.queries';
import { AppliedJob } from '../../../shared/types/types';

export const getJobPostFromCall = async (jobContent: string): Promise<void> => {
  try {
    const prompt = await loadTemplate('prompts', 'jobInfoExtraction', {
      jobContent: jobContent,
    });

    const instructions = await loadTemplate(
      'instructions',
      'jobInfoExtraction',
      {}
    );

    const response =
      process.env.NODE_ENV === 'testing'
        ? JobDescriptionMock
        : await getOpenAIResponse(instructions, prompt, JobDescriptionSchema);

    if (!response) throw new Error('OpenAI failed to process job description.');
    const parsedResponse = JobDescriptionSchema.safeParse(response);

    if (!parsedResponse.success) {
      throw new Error('Invalid response format for job description.');
    }

    await processJobInfo(jobContent, parsedResponse.data);
  } catch (error) {
    const e = error as Error;
    console.error(`Error processing job posting content: ${e.message}`);
    throw error;
  }
};

const processJobInfo = async (
  cont: string,
  data: Record<string, any>
): Promise<void> => {
  const content = cont
    .replace(/Applicants:\s*Applicants:/g, 'Applicants:')
    .replace(/Details:\s*Details:/g, 'Details:');
  const rawCompanyName = content.match(/Company:\s*(.+)/);
  const urlMatch = content.match(/URL:\s*(.+)/);
  const applicantMatch = content.match(/Applicants:\s*([\s\S]+?)(?:\n|$)/);
  const detailsMatch = content.match(/Details:\s*([\s\S]+?)(?:\n|$)/);
  const positionMatch = content.match(/Position:\s*(.+)/);

  const jobPosting = infoStore.jobPosting;


  jobPosting.rawCompanyName = rawCompanyName ? rawCompanyName[1] : '';
  jobPosting.companyName = jobPosting.rawCompanyName
    .replace(/\s+/g, '_')
    .toLowerCase();
  jobPosting.companyName = sanitizeText(jobPosting.companyName);
  jobPosting.position = (positionMatch ? positionMatch[1] : '')
    .trim()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and');
  jobPosting.applicantCount = applicantMatch ? applicantMatch[1] : '';
  jobPosting.jobDetails = (detailsMatch ? detailsMatch[1] : '')
    .trim()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and');
  jobPosting.url = urlMatch ? urlMatch[1].trim() : '';
  jobPosting.body = content;

  for (const key in jobPostingMapping) {
    const storeKey = key as keyof typeof jobPostingMapping;
    const dataKey = jobPostingMapping[storeKey];

    if (data[dataKey] !== undefined) {
      infoStore.jobPosting[storeKey] = data[dataKey];
    }
  }

  jobPosting.id = await insertJobInfo(jobPosting) ?? 0;

  await fs.promises.writeFile(
    paths.paths.jobData(jobPosting.companyName, jobPosting.id),
    content,
    'utf-8'
  );
};

export const setJobApplied = async (
  jobId: number,
  applied: boolean
): Promise<void> => {
  const applicationSent = await setApplied(jobId, applied);
};

export const updateJobInfo = async (id: number, appliedJob: AppliedJob): Promise<void> => {
    await updateApplication(appliedJob);
};
