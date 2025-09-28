import * as db from "../../../database";
import * as models from "../models";

import { AppliedJob } from "../../../shared/types/types";
import { loadTemplate } from "../../../shared/utils/templates/template.loader";
import { sendToLLM } from "../../../shared/libs/LLMs/providers";

export const trackNewJob = async (
  uid: string,
  jobContent: string,
  apiKey: string
): Promise<void> => {
  try {
    const [prompt, instructions] = await Promise.all([
      loadTemplate("prompts", "jobInfoExtraction", { jobContent }),
      loadTemplate("instructions", "jobInfoExtraction", {}),
    ]);

    const response = await getJobDescriptionResponse(
      jobContent,
      instructions,
      prompt,
      apiKey
    );
    const content = JSON.parse(jobContent);
    response.company_name = content.company_name;
    response.job_title = content.position;

    const parsed = parseJobDescription(response);

    await processJobInfo(uid, jobContent, parsed);
  } catch (error) {
    console.error(
      `Error processing job posting content: ${(error as Error).message}`
    );
    throw error;
  }
};

export const setJobApplied = async (
  jobId: number,
  applied: boolean
): Promise<void> => {

};

export const updateJobInfo = async (
  id: number,
  appliedJob: AppliedJob
): Promise<void> => {

};


// Helpers
const getJobDescriptionResponse = async (
  jobContent: string,
  instructions: string,
  prompt: string,
  apiKey?: string
): Promise<models.JobDescription> => {
  if (process.env.NODE_ENV === "testing") {
    return models.JobDescriptionMock;
  }

  const response = await sendToLLM(
    "cohere",
    instructions,
    prompt,
    models.JobDescriptionSchema,
    apiKey
  );

  if (!response) {
    throw new Error("OpenAI failed to process job description.");
  }

  return response as models.JobDescription;
};

const parseJobDescription = (response: unknown): models.JobDescription => {
  const parsed = models.JobDescriptionSchema.safeParse(response);
  if (!parsed.success) {
    throw new Error("Invalid response format for job description.");
  }
  return parsed.data;
};

const processJobInfo = async (
  uid: string,
  cont: string,
  data: models.JobDescription
): Promise<void> => {
  const res = await db.insertFullJobPosting(cont, data, uid);
  if (!res) throw new Error("Failed to insert job posting.");
};
