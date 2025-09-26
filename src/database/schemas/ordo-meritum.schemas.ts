import { Generated } from 'kysely';

// --------------------
// Core User
// --------------------
export interface User {
  firebaseUid: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

// --------------------
// Company & Role
// --------------------
export interface Company {
  id: Generated<number>;
  name: string;
  description: string;
  website: string;
  industry: string;
  size: string;
  location: string;
  culture: string;
  values: string;
  benefits: string;
}

export interface Role {
  id: Generated<number>;
  companyId: number;
  title: string;
  review: string;
  typicalSalaryAsk: string;
  typicalSalaryReason: string;
  advisedSalaryAsk: string;
  advisedSalaryReason: string;
  applicationProcess: string;
  expectedResponseTime: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

// --------------------
// Job Requirements
// --------------------
export interface JobRequirements {
  id: Generated<number>;
  roleId: number;
  description?: string;       // raw job body
  yearsOfExperience?: string;
  educationLevel?: string;
  tools?: string;             // JSON string array
  progLanguages?: string;     // JSON string array
  frameworksAndLibs?: string; // JSON string array
  databases?: string;         // JSON string array
  cloudPlatforms?: string;    // JSON string array
  industryKeywords?: string;  // JSON string array
  softSkills?: string;        // JSON string array
  certifications?: string;    // JSON string array
  requirements?: string;      // JSON string array
  niceToHaves?: string;       // JSON string array
  applicantCount?: string;
  codeAssessmentCompleted?: boolean;
  interviewCount?: number;
  initialApplicationUpdate?: Date;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

// --------------------
// Resume & Match Summary
// --------------------
export interface Resume {
  id: Generated<number>;
  firebaseUid: string;
  roleId: number;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface MatchSummary {
  id: Generated<number>;
  resumeId: number; // unique per resume
  shouldApply: string;       // e.g., "Strong Yes", "Yes", etc.
  reasoning: string;
  metrics?: string;          // JSON string
  overallSummary?: string;   // JSON string
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

// --------------------
// Experience
// --------------------
export interface Experience {
  id: Generated<number>;
  resumeId: number;
  position: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface ExperienceDescription {
  id: Generated<number>;
  experienceId: number;
  text: string;
  justificationForChange?: string;
  isNewSuggestion: boolean;
}

// --------------------
// Project
// --------------------
export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';

export interface Project {
  id: Generated<number>;
  resumeId: number;
  name: string;
  role: string;
  status: ProjectStatus;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface ProjectDescription {
  id: Generated<number>;
  projectId: number;
  text: string;
  justificationForChange?: string;
  isNewSuggestion: boolean;
}

// --------------------
// Skills
// --------------------
export interface Skill {
  id: Generated<number>;
  resumeId: number;
  category: string;
  justificationForChanges?: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface SkillItem {
  id: Generated<number>;
  skillId: number;
  name: string;
}

// --------------------
// Education
// --------------------
export interface Education {
  id: Generated<number>;
  resumeId: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  gpa?: string;
  honors?: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

// --------------------
// Candidate Questionnaires & Writing Samples
// --------------------
export interface CandidateQuestionnaire {
  id: Generated<number>;
  firebaseUid: string;
  title?: string;
  briefHistory?: string;
  questions: string; // JSON string array of categories + questions
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface CandidateWritingSample {
  id: Generated<number>;
  firebaseUid: string;
  content: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

// --------------------
// Questionnaire Responses (linked to CandidateQuestionnaire)
// --------------------
export interface QuestionnaireResponse {
  id: Generated<number>;
  questionnaireId: number;
  question: string;
  response: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

// --------------------
// Full DB
// --------------------
export interface DB {
  users: User;
  companies: Company;
  roles: Role;
  job_requirements: JobRequirements;
  resumes: Resume;
  match_summaries: MatchSummary;
  experiences: Experience;
  experience_descriptions: ExperienceDescription;
  projects: Project;
  project_descriptions: ProjectDescription;
  skills: Skill;
  skill_items: SkillItem;
  education: Education;
  candidate_questionnaires: CandidateQuestionnaire;
  candidate_writing_samples: CandidateWritingSample;
  questionnaire_responses: QuestionnaireResponse;
}
