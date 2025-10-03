import * as schemas from "@features/job_guide/models/domain/index.js";

import { db, getResumeId } from "../../index.js";

import { ShouldApply } from "@database/schemas/ordo-meritum.schemas.js";

export const insertMatchSummary = async (
  firebase_uid: string,
  role_id: number,
  summary: schemas.MatchSummaryType
) => {
  await deleteMatchSummaryIfExists(firebase_uid, role_id);
  const resume_id = await getResumeId(firebase_uid, role_id);
  if (!resume_id) {
    return null;
  }

  const overall_summary = summary.match_summary.overall_match_summary;

  const match_id = await db
    .insertInto("match_summaries")
    .values({
      resume_id: resume_id,
      should_apply: summary.match_summary.should_apply,
      reasoning: summary.match_summary.should_apply_reasoning,
      overall_match_score: overall_summary.overall_match_score,
      suggestions: overall_summary.suggestions,
    })
    .returning("id")
    .executeTakeFirst();

  if (!match_id) {
    return null;
  }

  for (const item of overall_summary.summary) {
    await db
      .insertInto("match_summary_overviews")
      .values({
        match_summary_id: match_id.id,
        summary: item.summary_text,
        summary_temperature: item.summary_temperature,
      })
      .execute();
  }

  const metrics = summary.match_summary.metrics;

  for (const metric of metrics) {
    await db
      .insertInto("metrics")
      .values({
        match_summary_id: match_id.id,
        score_title: metric.score_title,
        raw_score: metric.raw_score,
        weighted_score: metric.weighted_score,
        score_weight: metric.score_weight,
        score_reason: metric.score_reason,
        is_compatible: metric.isCompatible,
        strength: metric.strength,
        weaknesses: metric.weaknesses,
      })
      .execute();
  }
};


export const deleteMatchSummaryIfExists = async (
  firebase_uid: string,
  role_id: number
) => {
  const resume_id = await getResumeId(firebase_uid, role_id);
  if (!resume_id) return null;

  await db.transaction().execute(async (trx) => {
    const matchSummaries = await trx
      .selectFrom("match_summaries")
      .select("id")
      .where("resume_id", "=", resume_id)
      .execute();

    if (matchSummaries.length === 0) return;

    const matchIds = matchSummaries.map((m) => m.id);

    await trx
      .deleteFrom("match_summary_overviews")
      .where("match_summary_id", "in", matchIds)
      .execute();

    await trx
      .deleteFrom("metrics")
      .where("match_summary_id", "in", matchIds)
      .execute();

    await trx
      .deleteFrom("match_summaries")
      .where("id", "in", matchIds)
      .execute();
  });

  return true;
};
