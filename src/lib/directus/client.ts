import axios, { type AxiosResponse } from 'axios';
import { env } from '../env';

const DIRECTUS_TIMEOUT = 10000;

export const directusClient = axios.create({
  baseURL: env.VITE_DIRECTUS_URL,
  timeout: DIRECTUS_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    directusClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete directusClient.defaults.headers.common['Authorization'];
  }
}

directusClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

directusClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      setAccessToken(null);
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new CustomEvent('pjm:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export interface DirectusQueryParams {
  fields?: string[];
  filter?: Record<string, unknown>;
  sort?: string[];
  page?: number;
  limit?: number;
  search?: string;
  deep?: Record<string, unknown>;
}

export function buildQueryParams(params?: DirectusQueryParams): Record<string, string> {
  if (!params) return {};

  const query: Record<string, string> = {};

  if (params.fields?.length) {
    query['fields'] = params.fields.join(',');
  }
  if (params.sort?.length) {
    query['sort'] = params.sort.join(',');
  }
  if (params.page !== undefined) {
    query['page'] = String(params.page);
  }
  if (params.limit !== undefined) {
    query['limit'] = String(params.limit);
  }
  if (params.search) {
    query['search'] = params.search;
  }
  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      if (typeof value === 'object' && value !== null) {
        for (const [op, val] of Object.entries(value as Record<string, unknown>)) {
          query[`filter[${key}][${op}]`] = String(val);
        }
      } else {
        query[`filter[${key}][_eq]`] = String(value);
      }
    }
  }
  if (params.deep) {
    for (const [key, value] of Object.entries(params.deep)) {
      query[`deep[${key}]`] = JSON.stringify(value);
    }
  }

  return query;
}

export async function directusGet<T>(
  collection: string,
  params?: DirectusQueryParams,
  signal?: AbortSignal
): Promise<T[]> {
  const response: AxiosResponse<{ data: T[] }> = await directusClient.get(`/items/${collection}`, {
    params: buildQueryParams(params),
    signal,
  });
  return response.data.data;
}

export async function directusGetById<T>(
  collection: string,
  id: string,
  fields?: string[],
  signal?: AbortSignal
): Promise<T> {
  const response: AxiosResponse<{ data: T }> = await directusClient.get(`/items/${collection}/${id}`, {
    params: fields?.length ? { fields: fields.join(',') } : undefined,
    signal,
  });
  return response.data.data;
}

export async function directusCount(
  collection: string,
  filter?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<number> {
  const response: AxiosResponse<{ meta: { total_count: number } }> = await directusClient.get(
    `/items/${collection}`,
    {
      params: {
        ...buildQueryParams({ filter, limit: 0 }),
        meta: 'total_count',
      },
      signal,
    }
  );
  return response.data?.meta?.total_count ?? 0;
}
