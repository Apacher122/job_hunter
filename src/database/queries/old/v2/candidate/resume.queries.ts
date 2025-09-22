import {
  $Enums,
  Candidate,
  Experience,
  ExperienceDescription,
  Prisma,
  PrismaClient,
  Resume,
} from '@prisma/client';
import { JobPosting } from '../../../../../shared/data/info.store.js';
import prisma from '../../../../prisma_client.js';
import { AppliedJob } from '../../../../../shared/types/types.js';

export const createResume = async (
  candidateId: number,
  jobId: number
): Promise<Resume> => {
  return prisma.resume.create({
    data: {
      candidate: { connect: { id: candidateId } },
      ...(jobId && { jobPosting: { connect: { id: jobId } } }),
    },
  });
};

// Experience

export const addExperience = async (
  resumeId: number,
  data: {
    position: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    descriptions?: {
      text: string;
      justificationForChange?: string;
      isNewSuggestion?: boolean;
    }[];
  }
): Promise<Experience> => {
  return prisma.experience.create({
    data: {
      resume: { connect: { id: resumeId } },
      position: data.position,
      company: data.company,
      startDate: data.startDate,
      endDate: data.endDate,
      ...(data.descriptions && {
        descriptionItems: {
          create: data.descriptions.map((desc) => ({
            text: desc.text,
            justificationForChange: desc.justificationForChange,
            isNewSuggestion: desc.isNewSuggestion ?? false,
          })),
        },
      }),
    },
    include: { descriptionItems: true },
  });
};

export const addExperienceDescription = async (
  experienceId: number,
  data: {
    text: string;
    justificationForChange?: string;
    isNewSuggestion?: boolean;
  }
): Promise<ExperienceDescription> => {
  return prisma.experienceDescription.create({
    data: {
      experience: { connect: { id: experienceId } },
      text: data.text,
      justificationForChange: data.justificationForChange,
      isNewSuggestion: data.isNewSuggestion ?? false,
    },
  });
};
