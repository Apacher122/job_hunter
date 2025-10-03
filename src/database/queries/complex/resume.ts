import * as schemas from "@features/documents/models/index.js";

import { db } from "../../index.js";

export const getResumeId = async (firebase_uid: string, role_id: number) => {
  const result = await db
    .selectFrom("resumes")
    .select("id")
    .where("firebase_uid", "=", firebase_uid)
    .where("role_id", "=", role_id)
    .executeTakeFirst();

  return result?.id ?? null;
};

export const upsertResume = async (
  firebase_uid: string,
  role_id: number,
  resume: schemas.ResumeItemsType
) => {
  const resume_id = await getResumeId(firebase_uid, role_id);
  if (!resume_id || !resume) {
    return;
  }
  await dropResume(resume_id);

  for (const skills of resume.skills) {
    const skill_id = (
      await db
        .insertInto("skills")
        .values({
          resume_id: resume_id,
          category: skills.category,
          justification_for_changes: skills.justification_for_changes,
        })
        .onConflict((oc) =>
          oc.column("id").doUpdateSet({
            resume_id,
            category: skills.category,
            justification_for_changes: skills.justification_for_changes,
          })
        )
        .returning("id")
        .execute()
    )[0].id;

    for (const skill of skills.skill) {
      await db
        .insertInto("skill_items")
        .values({
          skill_id: skill_id,
          name: skill.item,
        })
        .execute();
    }
  }

  for (const exp of resume.experiences) {
    const exp_id = (
      await db
        .insertInto("experiences")
        .values({
          resume_id: resume_id,
          position: exp.position,
          company: exp.company,
          start_date: new Date(exp.start),
          end_date: new Date(exp.end),
        })
        .returning("id")
        .execute()
    )[0].id;

    for (const details of exp.description) {
      await db
        .insertInto("experience_descriptions")
        .values({
          exp_id: exp_id,
          text: details.text,
          new_suggestion: details.is_new_suggestion,
          justification_for_change: details.justification_for_change,
        })
        .execute();
    }
  }

  for (const proj of resume.projects) {
    const project_id = (
      await db
        .insertInto("projects")
        .values({
          resume_id: resume_id,
          name: proj.name,
          role: proj.role,
          status: "ACTIVE",
        })
        .returning("id")
        .execute()
    )[0].id;

    for (const details of proj.description) {
      await db
        .insertInto("project_descriptions")
        .values({
          project_id: project_id,
          text: details.text,
          new_suggestion: details.is_new_suggestion,
          justification_for_change: details.justification_for_change,
        })
        .execute();
    }
  }
};

export const dropResume = async (resume_id: number) => {
  await db.transaction().execute(async (trx) => {
    await trx
      .deleteFrom("experience_descriptions")
      .where("exp_id", "in", (eb) =>
        eb
          .selectFrom("experiences")
          .select("id")
          .where("resume_id", "=", resume_id)
      )
      .execute();

    await trx
      .deleteFrom("experiences")
      .where("resume_id", "=", resume_id)
      .execute();

    await trx
      .deleteFrom("project_descriptions")
      .where("project_id", "in", (eb) =>
        eb
          .selectFrom("projects")
          .select("id")
          .where("resume_id", "=", resume_id)
      )
      .execute();

    await trx
      .deleteFrom("projects")
      .where("resume_id", "=", resume_id)
      .execute();

    await trx
      .deleteFrom("skill_items")
      .where("skill_id", "in", (eb) =>
        eb.selectFrom("skills").select("id").where("resume_id", "=", resume_id)
      )
      .execute();

    await trx.deleteFrom("skills").where("resume_id", "=", resume_id).execute();
  });
};

export const getFullResume = async (firebase_uid: string, role_id: number) => {
  const resumeId = await getResumeId(firebase_uid, role_id);
  if (!resumeId) {
    return null;
  }
  const resume = await db
    .selectFrom("resumes")
    .selectAll()
    .where("id", "=", resumeId)
    .executeTakeFirst();

  const experiences = await db
    .selectFrom("experiences")
    .selectAll()
    .where("resume_id", "=", resumeId)
    .execute();

  const experienceDescriptions = await db
    .selectFrom("experience_descriptions")
    .selectAll()
    .where(
      "exp_id",
      "in",
      experiences.map((e) => e.id)
    )
    .execute();

  const projects = await db
    .selectFrom("projects")
    .selectAll()
    .where("resume_id", "=", resumeId)
    .execute();

  const projectDescriptions = await db
    .selectFrom("project_descriptions")
    .selectAll()
    .where(
      "project_id",
      "in",
      projects.map((p) => p.id)
    )
    .execute();

  const skills = await db
    .selectFrom("skills")
    .selectAll()
    .where("resume_id", "=", resumeId)
    .execute();

  const skillItems = await db
    .selectFrom("skill_items")
    .selectAll()
    .where(
      "skill_id",
      "in",
      skills.map((s) => s.id)
    )
    .execute();

  return {
    resume,
    experiences: experiences.map((e) => ({
      ...e,
      descriptions: experienceDescriptions.filter((d) => d.exp_id === e.id),
    })),
    projects: projects.map((p) => ({
      ...p,
      descriptions: projectDescriptions.filter((d) => d.project_id === p.id),
    })),
    skills: skills.map((s) => ({
      ...s,
      items: skillItems.filter((i) => i.skill_id === s.id),
    })),
  };
};
