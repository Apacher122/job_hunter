import {
  Experience,
  ExperienceDescription,
} from "../../../schemas/ordo-meritum.schemas.js";

import { db } from "../../../index.js";

export const createExperience = async (
  experience: Omit<Experience, "id" | "created_at" | "updated_at">
) => {
  return await db
    .insertInto("experiences")
    .values(experience)
    .returningAll()
    .executeTakeFirst();
};

export const updateExperience = async (
  id: number,
  updates: Partial<Omit<Experience, "id" | "created_at" | "updated_at">>
) => {
  return await db
    .updateTable("experiences")
    .set(updates)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

export const getExperienceById = async (id: number) => {
  return await db
    .selectFrom("experiences")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
};

export const deleteExperience = async (id: number) => {
  return await db.deleteFrom("experiences").where("id", "=", id).execute();
};

export const createExperienceDescription = async (
  desc: Omit<ExperienceDescription, "id">
) => {
  return await db
    .insertInto("experience_descriptions")
    .values(desc)
    .returningAll()
    .executeTakeFirst();
};

export const updateExperienceDescription = async (
  id: number,
  updates: Partial<Omit<ExperienceDescription, "id">>
) => {
  return await db
    .updateTable("experience_descriptions")
    .set(updates)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

export const getExperienceDescriptionById = async (id: number) => {
  return await db
    .selectFrom("experience_descriptions")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
};

export const deleteExperienceDescription = async (resume_id: number) => {
  return await db
    .deleteFrom("experience_descriptions")
    .where("exp_id", "in", (eb) =>
      eb
        .selectFrom("experiences")
        .select("id")
        .where("resume_id", "=", resume_id)
    )
    .execute();
};


export const deleteExperienceByResumeId = async (resume_id: number) => {
  return await db
    .deleteFrom("experiences")
    .where("resume_id", "=", resume_id)
    .execute();
};