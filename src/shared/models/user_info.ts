import { z } from "zod";

export const UserInfoSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    summary: z.string(),
    location: z.string().optional(),
    current_location: z.string().optional(),
    mobile: z.string().optional(),
    email: z.string().email(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
})

export const EducationInfoSchema = z.object({
    school: z.string(),
    degree: z.string(),
    start_end: z.string(),
    location: z.string().optional(),
    coursework: z.string().optional(),
    undergraduate_coursework: z.string().optional(),
    graduate_coursework: z.string().optional(),
    education_summary: z.string().optional(),
})

export type UserInfoType = z.infer<typeof UserInfoSchema>
export type EducationInfoType = z.infer<typeof EducationInfoSchema>