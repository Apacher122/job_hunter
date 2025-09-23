import { db } from '../../../index';
import { SuggestedChange } from '../../../schemas/ordo-meritum.schemas';

export const getSuggestedChangeById = (id: number) =>
  db.selectFrom('suggeted_change').selectAll().where('id', '=', id).executeTakeFirst();

export const getSuggestedChangesByEntity = (entity: string, entityId: number) =>
  db.selectFrom('suggeted_change')
    .selectAll()
    .where('entity', '=', entity)
    .where('entity_id', '=', entityId)
    .execute();

export const createSuggestedChange = (change: Omit<SuggestedChange, 'id' | 'created_at'>) =>
  db.insertInto('suggeted_change').values(change).returningAll().executeTakeFirst();

export const updateSuggestedChange = (id: number, change: Partial<Omit<SuggestedChange, 'id' | 'created_at'>>) =>
  db.updateTable('suggeted_change').set(change).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteSuggestedChange = (id: number) =>
  db.deleteFrom('suggeted_change').where('id', '=', id).execute();
