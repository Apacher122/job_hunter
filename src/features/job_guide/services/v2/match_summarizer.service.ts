import * as commonSchemas from '@shared/models/index.js';
import * as db from '@database/index.js';
import * as pretty from '@shared/utils/formatters/pretty_string.js';
import * as schemas from '../../models/domain/index.js';

import { MatchSummaryType } from '../../models/domain/index.js';
import { loadTemplate } from '../../../../shared/utils/templates/template.loader.js';
import { sendToLLM } from '@shared/libs/LLMs/providers.js';

export const getMatchSummary = async (
  uid: string,
  jobId: number,
  getNew = true,
  apiKey: string,
  payload?: any
): Promise<MatchSummaryType> => {
  try {
    const jobPost = await db.getFullJobPosting(jobId, uid);
    if (!jobPost) throw new Error('No job post found.');
    const jobPostString = pretty.prettyJobPost(jobPost as any);
    
    const educationInfo = commonSchemas.EducationInfoSchema.safeParse(payload.educationInfo);
    if (!educationInfo.success) throw new Error('Invalid education info.');
    const educationInfoString = pretty.prettyEducationInfo(educationInfo.data as commonSchemas.EducationInfoType);

    const applicantCount = jobPost.applicant_count;

    const resume = db.getFullResume(uid, jobId);
    if (!resume) throw new Error('No resume found.');

    const coverLetter = payload.coverLetter;

    const instructions = await loadTemplate('instructions', 'matchSummary', {});

    const prompt = await loadTemplate('prompts', 'matchSummary', {
      applicants: String(applicantCount),
      jobPost: jobPostString,
      education: educationInfoString,
      resume: JSON.stringify(resume),
      coverLetter: coverLetter,
    });

    const response = await sendToLLM(
      'cohere',
      instructions,
      prompt,
      schemas.MatchSummarySchema,
      apiKey
    );

    const matchSummary = schemas.MatchSummarySchema.safeParse(response);
    if (!matchSummary.success) throw new Error('Invalid match summary.');

    await db.insertMatchSummary(uid, jobId, matchSummary.data);
    return matchSummary.data;
  } catch (error) {
    const e = error as Error;
    throw new Error(`Error retrieving match summary: ${e.message}`);
  }
};

// export async function fetchMatchSumary(id: number): Promise<MatchSummaryType> {
//   const res = await getMatchSummary(id, false);

//   if (!res) {
//     throw new Error(`Unable to get Match Summary for id: ${id}`);
//   }

//   return res.match_summary;
// }
