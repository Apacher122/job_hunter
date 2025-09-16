import { z } from 'zod';

export const ExperienceSchema = z.object({
  experiences: z.array(
    z.object({
      position: z.string(),
      company: z.string(),
      start: z.string(),
      end: z.string(),
      description: z.array(
        z.object({
          text: z.string(),
          justification_for_change: z.string(),
          is_new_suggestion: z.boolean(),
        })
      ),
    })
  ),
});

export const SkillSchema = z.object({
  skills: z.array(
    z.object({
      category: z.string(),
      skill: z.array(
        z.object({
          item: z.string(),
        })
      ),
      justification_for_changes: z.string(),
    })
  ),
});

export const ProjectSchema = z.object({
  projects: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      status: z.string(),
      description: z.array(
        z.object({
          text: z.string(),
          justification_for_change: z.string(),
          is_new_suggestion: z.boolean(),
        })
      ),
    })
  ),
});

export type Experience = z.infer<typeof ExperienceSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ResumeItemsType = z.infer<typeof ResumeItems>;

export const ResumeItems = z.object({
  experiences: ExperienceSchema.shape.experiences,
  skills: SkillSchema.shape.skills,
  projects: ProjectSchema.shape.projects,
});

export const resumeItemsResponse = z.union([
  ExperienceSchema,
  SkillSchema,
  ProjectSchema,
]);
