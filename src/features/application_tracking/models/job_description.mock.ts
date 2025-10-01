import { JobDescriptionSchema } from './job_description.js';

export const JobDescriptionMock = JobDescriptionSchema.parse({
  job_title: "Senior Software Engineer",
  company_name: "TechNova Solutions",
  years_of_exp: "5+ years",
  education_level: "Bachelor's in Computer Science or related field",
  website: "https://www.technova.com",
  applicant_count: 10,
  post_age: "1 day",
  skills_required: ["Problem-solving", "Communication", "Team collaboration"],
  skills_nice_to_haves: ["Mentoring", "Agile methodologies", "Technical writing"],
  tools_and_technologies: ["Git", "Docker", "Jenkins", "Kubernetes"],
  programming_languages: ["JavaScript", "TypeScript", "Python"],
  frameworks_and_libraries: ["React", "Node.js", "Express"],
  databases: ["PostgreSQL", "MongoDB", "Redis"],
  cloud_platforms: ["AWS", "Azure", "GCP"],
  industry_keywords: ["FinTech", "SaaS", "Agile development"],
  soft_skills: ["Adaptability", "Critical thinking", "Leadership"],
  certifications: ["AWS Certified Solutions Architect", "Scrum Master"],
  company_culture: '"Innovative", "Collaborative", "Inclusive"',
  company_values:'["Integrity", "Customer first", "Continuous learning"',
  salary_range: "$120,000 - $150,000"
});
