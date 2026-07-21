import { env } from '../env';

export function directusCollectionUrl(collection: string, id: string): string {
  const base = env.VITE_DIRECTUS_APP_URL;
  if (!base) return '';
  return `${base}/content/${collection}/${id}`;
}
