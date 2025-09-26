import { Candidate, EducationInformation, Prisma } from '@prisma/client';
import prisma from '../../../../prisma_client.js';

export const createCandidate = async (
  data: Prisma.CandidateCreateInput, 
): Promise<number> => {
  const newCandidate = await prisma.candidate.create({
    data,
  });

  return newCandidate.id;
};

export const updateCandidate = async (
  id: number,
  data: Prisma.CandidateUpdateInput
): Promise<Candidate> => {
  return await prisma.candidate.update({
    where: { id },
    data,
  });
};

export const getCandidate = async (id: number): Promise<Candidate | null> => {
  const candidate = await prisma.candidate.findUnique({
    where: { id },
  });
  return candidate;
};

// Education

export const addEducation = async (
  candidateId: number,
  data: Prisma.EducationInformationCreateInput,
): Promise<EducationInformation> => {
  return prisma.educationInformation.create({
    data,
  })
}
