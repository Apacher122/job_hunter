export type ApplicationStatus = 'OPEN' | 'REJECTED' | 'OFFERED';
export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
export type EducationLevel =
  | 'NONE'
  | 'HIGH_SCHOOL'
  | 'ASSOCIATE'
  | 'BACHELORS'
  | 'MASTERS'
  | 'DOCTORATE'
  | 'OTHER';

export interface Candidate {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone?: string;
  created_at: Date;
  update_at: Date;
}

export interface EducationInformation {
  id: number;
  school_name: string;
  degree: string;
  location: string;
  start_date: Date;
  end_date?: Date;
  education_summary?: string;
  coursework?: string;
  candidate_id: number;
}

export interface Resume {
  id: number;
  candidate_id?: number;
  job_posting_id?: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Experience {
  id: number;
  resume_id?: number;
  position: string;
  company: string;
  start_date: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ExperienceDescription {
  id: number;
  experience_id: number;
  text: string;
  justification_for_change?: string;
  is_new_suggestion: boolean;
}

export interface Project {
  id: number;
  resume_id?: number;
  name: string;
  role: string;
  status: ProjectStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectDescription {
  id: number;
  project_id: number;
  text: string;
  justification_for_change?: string;
  is_new_suggestion: boolean;
}

export interface Skill {
  id: number;
  resume_id?: number;
  category: string;
  justification_for_changes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SkillItem {
  id: number;
  skill_id: number;
  item: string;
}

export interface MatchSummary {
  id: number;
  job_posting_id: number;
  should_apply: string;
  should_apply_reasoning?: string;
  metrics?: any;
  overall_summary?: any;
  projects_section_missing_entries?: boolean;
  created_at: Date;
  updated_at: Date;
  resume_id?: number;
}

export interface JobPosting {
  id: number;
  body?: string;
  company_name?: string;
  raw_company_name?: string;
  url?: string;
  position?: string;
  position_summary?: string;
  years_of_experience?: string;
  education_level?: EducationLevel;
  salary?: string;
  applicant_count?: string;
  job_details?: string;
  user_applied?: boolean;
  applied_on?: Date;
  status: ApplicationStatus;
  code_assessment_completed?: boolean;
  interview_count?: number;
  initial_application_update?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface JobInfo {
  job_posting_id: number;
  company_description?: string;
  company_website?: string;
  company_industry?: string;
  company_size?: string;
  company_location?: string;
  company_culture?: string;
  company_values?: string;
  company_benefits?: string;
  position_review?: string;
  typical_salary_ask?: string;
  typical_salary_ask_reasoning?: string;
  advised_salary_ask?: string;
  advised_salary_ask_reasoning?: string;
  application_process?: string;
  expected_response_time?: string;
}

export interface AdditionalInformation {
  id: number;
  job_posting_id: number;
  information_title?: string;
  text?: string;
  created_at: Date;
}

export interface PossibleInterviewQuestion {
  id: number;
  job_posting_id: number;
  is_behavioral_or_technical?: string;
  question: string;
  question_source?: string;
  answer?: string;
  what_they_look_for?: string;
  what_to_study?: string;
}

export interface SuggestedChange {
  id: number;
  entity: string;
  entity_id: number;
  text: string;
  justification?: string;
  is_new: boolean;
  created_at: Date;
  resolved: boolean;
}

// Many-to-Many / Join Tables
export interface JobPostingTool {
  job_posting_id: number;
  tool: string;
}

export interface JobPostingProgLanguage {
  job_posting_id: number;
  language: string;
}

export interface JobPostingFramework {
  job_posting_id: number;
  framework: string;
}

export interface JobPostingDatabase {
  job_posting_id: number;
  database: string;
}

export interface JobPostingCloudPlatform {
  job_posting_id: number;
  cloud: string;
}

export interface JobPostingIndustryKeyword {
  job_posting_id: number;
  keyword: string;
}

export interface JobPostingSoftSkill {
  job_posting_id: number;
  soft_skill: string;
}

export interface JobPostingCertification {
  job_posting_id: number;
  certification: string;
}

export interface JobPostingCompanyCulture {
  job_posting_id: number;
  culture: string;
}

export interface JobPostingCompanyValue {
  job_posting_id: number;
  value: string;
}

export interface JobPostingRequirement {
  job_posting_id: number;
  requirement: string;
}

export interface DB {
  candidates: Candidate;
  education_information: EducationInformation;
  resumes: Resume;
  experiences: Experience;
  experience_descriptions: ExperienceDescription;
  projects: Project;
  project_descriptions: ProjectDescription;
  skills: Skill;
  skill_items: SkillItem;
  match_summaries: MatchSummary;
  job_postings: JobPosting;
  job_info: JobInfo;
  additional_information: AdditionalInformation;
  possible_interview_question: PossibleInterviewQuestion;
  suggeted_change: SuggestedChange;
  job_posting_tools: JobPostingTool;
  job_posting_prog_languages: JobPostingProgLanguage;
  job_posting_frameworks: JobPostingFramework;
  job_posting_databases: JobPostingDatabase;
  job_posting_cloud_platforms: JobPostingCloudPlatform;
  job_posting_industry_keywords: JobPostingIndustryKeyword;
  job_posting_soft_skills: JobPostingSoftSkill;
  job_posting_certifications: JobPostingCertification;
  job_posting_company_cultures: JobPostingCompanyCulture;
  job_posting_company_values: JobPostingCompanyValue;
  job_posting_requirements: JobPostingRequirement;
}
