import fs from 'fs';
import { getOpenAIResponse } from '../../../../shared/libs/open_ai/openai.js';
import { infoStore } from '../../../../shared/data/info.store.js';
import { loadTemplate } from '../../../../shared/utils/templates/template.loader.js';
import paths from '../../../../shared/constants/paths.js';
import { getJobPost } from '../../../../database/queries/v2/job.queries.js';
import { convertPDFToBase64 } from '../../../../shared/utils/documents/pdf/pdf.helpers.js';
import { MatchSummaryMock } from '../../models/mocks/match_summary.mocks.js';
import {
  MatchSummarySchema,
  MatchSummaryType,
} from '../../models/match_summary.models';
import { upsertMatchSummary } from '../../../../database/queries/v2/guide.queries.js';
import { getMatchSummary as getMatches } from '../../../../database/queries/v2/guide.queries.js';

export const getMatchSummary = async (
  id: number,
  getNew: boolean
): Promise<MatchSummaryType> => {
  try {
    const jobPosting = await getJobPost(id);
    if (jobPosting === null) {
      console.error(`${jobPosting}`);
      throw new Error('No job post found.');
    }
    console.log(
      `MATCH SUMMARY - creating match summary for ${jobPosting.rawCompanyName} - ${jobPosting.position}`
    );

    let jobId = id;
    let companyName = jobPosting.companyName;
    if (process.env.NODE_ENV === 'testing') {
      jobId = 0;
      companyName = 'test';
    }

    const existingEntry = await getMatches(jobId);
    if (existingEntry && !getNew) return existingEntry;

    const education = {
      school: infoStore.education_info.school,
      degree: infoStore.education_info.degree,
      start_end: infoStore.education_info.start_end,
      location: infoStore.education_info.location,
      coursework: infoStore.education_info.coursework,
    };

    fs.writeFileSync(
      paths.paths.sectionJson('education'),
      JSON.stringify(education, null, 2)
    );

    let resumeJson: string;
    try {
      resumeJson = await fs.promises.readFile(
        paths.paths.jsonResume(companyName, jobId)
      );
    } catch (err) {
      throw new Error('No resume information found.')
    }

    const coverLetterB64 =
      (await convertPDFToBase64(
        paths.paths.movedCoverLetter(companyName, jobId)
      )) ?? '';

    const instructions = await loadTemplate('instructions', 'matchsummary', {});

    const prompt = await loadTemplate('prompts', 'matchsummary', {
      applicants: jobPosting.applicantCount,
      details: jobPosting.jobDetails,
      education: JSON.stringify(education),
      resume: JSON.stringify(resumeJson),
      coverLetter: coverLetterB64,
      jobPosting: jobPosting.body,
      company: jobPosting.rawCompanyName,
      position: jobPosting.position,
    });
    const res =
      process.env.NODE_ENV === 'testing'
        ? MatchSummaryMock
        : await getOpenAIResponse(instructions, prompt, MatchSummarySchema);

    if (!res) {
      throw new Error('No match summary response received from OpenAI.');
    }

    const parsed = MatchSummarySchema.parse(res);

    const saved = await upsertMatchSummary(jobId, parsed.match_summary);

    return saved;
  } catch (error) {
    const e = error as Error;
    throw new Error(`Error retrieving match summary: ${e.message}`);
  }
};

export async function fetchMatchSumary(id: number): Promise<MatchSummaryType> {
  const res = await getMatchSummary(id, false);

  if (!res) {
    throw new Error(`Unable to get Match Summary for id: ${id}`);
  }

  return res.match_summary;
}
