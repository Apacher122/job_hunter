import { Generated } from 'kysely';

// --------------------
// Core User
// --------------------
export interface User {
  firebase_uid: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

// --------------------
// Company & Role
// --------------------
export interface Company {
  id: Generated<number>;
  company_name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  company_culture?: string;
  company_values?: string;
  benefits?: string;
}

export type AppStatus = 'REJECT' | 'OFFERED' | 'OPEN' | 'CLOSED' | 'MOVED' | 'NOT_APPLIED' | 'GHOSTED' | 'INTERVIEWING';
export type ShouldApply = 'Strong Yes' | 'Yes' | 'No' | 'Strong No' | 'Maybe';
export type Temperature = 'Good' | 'Neutral' | 'Bad';
export interface Role {
  id: Generated<number>;
  company_id: number;
  job_title: string;
  description?: string;
  salary_range?: string;
  typical_salary_ask?: string;
  typical_salary_reason?: string;
  advised_salary_ask?: string;
  advised_salary_reason?: string;
  application_process?: string;
  expected_response_time?: string;
  application_status?: AppStatus;
  user_applied?: boolean;
  created_at?: Generated<Date>;
  updated_at?: Generated<Date>;
}

// --------------------
// Job Requirements
// --------------------
export interface JobRequirements {
  id: Generated<number>;
  role_id: number;
  other_info?: string;       // raw job body
  years_of_exp?: string;
  education_level?: string;
  tools?: string[];             // JSON string array
  programming_languages?: string[];     // JSON string array
  frameworks_and_libraries?: string[]; // JSON string array
  databases?: string[];         // JSON string array
  cloud_technologies?: string[];    // JSON string array
  industry_keywords?: string[];  // JSON string array
  soft_skills?: string[];        // JSON string array
  certifications?: string[];    // JSON string array
  requirements?: string[];      // JSON string array
  nice_to_haves?: string[];       // JSON string array
  applicant_count?: number;
  code_assessment_completed?: boolean;
  interview_count?: number;
  initial_application_date?: Date;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

// --------------------
// Resume & Match Summary
// --------------------
export interface Resume {
  id: Generated<number>;
  firebase_uid: string;
  role_id: number;
  applied_on?: Date;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface MatchSummary {
  id: Generated<number>;
  resume_id: number; // unique per resume
  should_apply: ShouldApply;       // e.g., "Strong Yes", "Yes", etc.
  reasoning: string;
  overall_match_score?: number;
  suggestions?: string[];
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface MatchSummaryOverview {
  id: Generated<number>;
  match_summary_id: number;
  summary: string;
  summary_temperature: Temperature;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface Metrics {
  id: Generated<number>;
  match_summary_id: number;
  score_title: string;
  raw_score: number;
  weighted_score: number;
  score_weight: number;
  score_reason?: string;
  is_compatible?: boolean;
  strength?: string;
  weaknesses?: string;
}

// --------------------
// Experience
// --------------------
export interface Experience {
  id: Generated<number>;
  resume_id: number;
  position: string;
  company: string;
  start_date: Date;
  end_date?: Date;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface ExperienceDescription {
  id: Generated<number>;
  exp_id: number;
  text: string;
  justification_for_change?: string;
  new_suggestion: boolean;
}

// --------------------
// Project
// --------------------
export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';

export interface Project {
  id: Generated<number>;
  resume_id: number;
  name: string;
  role: string;
  status: ProjectStatus;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface ProjectDescription {
  id: Generated<number>;
  project_id: number;
  text: string;
  justification_for_change?: string;
  new_suggestion: boolean;
}

// --------------------
// Skills
// --------------------
export interface Skill {
  id: Generated<number>;
  resume_id: number;
  category: string;
  justification_for_changes?: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface SkillItem {
  id: Generated<number>;
  skill_id: number;
  name: string;
}

// --------------------
// Education
// --------------------
export interface Education {
  id: Generated<number>;
  resume_id: number;
  school: string;
  degree: string;
  field_of_study: string;
  start_date: Date;
  end_date?: Date;
  gpa?: string;
  honors?: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

// --------------------
// Candidate Questionnaires & Writing Samples
// --------------------
export interface CandidateQuestionnaire {
  id: Generated<number>;
  firebase_uid: string;
  title?: string;
  brief_history?: string;
  questions: string; // JSON string array of categories + questions
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface CandidateWritingSample {
  id: Generated<number>;
  firebase_uid: string;
  content: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

// --------------------
// Questionnaire Responses (linked to CandidateQuestionnaire)
// --------------------
export interface QuestionnaireResponse {
  id: Generated<number>;
  questionnaire_id: number;
  question: string;
  response: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
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
  match_summary_overviews: MatchSummaryOverview;
  metrics: Metrics;
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
