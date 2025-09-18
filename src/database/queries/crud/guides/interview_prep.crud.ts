import { db } from '../../../index';
import { PossibleInterviewQuestion } from '../../../schemas/ordo-meritum.schemas';

export const getQuestionById = (id: number) =>
  db.selectFrom('possible_interview_question').selectAll().where('id', '=', id).executeTakeFirst();

export const getQuestionsByJobPostingId = (job_posting_id: number) =>
  db.selectFrom('possible_interview_question').selectAll().where('job_posting_id', '=', job_posting_id).execute();

export const createQuestion = (q: Omit<PossibleInterviewQuestion, 'id'>) =>
  db.insertInto('possible_interview_question').values(q).returningAll().executeTakeFirst();

export const updateQuestion = (id: number, q: Partial<Omit<PossibleInterviewQuestion, 'id'>>) =>
  db.updateTable('possible_interview_question').set(q).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteQuestion = (id: number) =>
  db.deleteFrom('possible_interview_question').where('id', '=', id).execute();
