import type { ScheduleSnapshotResponse, SnapshotData } from '../types/schedule';

const DEFAULT_BASE_URL = 'http://127.0.0.1:8000';
const REQUEST_TIMEOUT_MS = 9000;

export interface ApiConfig {
  baseUrl: string;
}

const resolveBaseUrl = (): string => {
  const viaExpoExtra = process.env.EXPO_PUBLIC_UTC_API_BASE_URL;

  if (viaExpoExtra && viaExpoExtra.trim().length > 0) {
    return viaExpoExtra;
  }

  return DEFAULT_BASE_URL;
};

export const apiConfig: ApiConfig = {
  baseUrl: resolveBaseUrl(),
};

const buildEndpoint = (path: string): string => {
  const root = apiConfig.baseUrl.endsWith('/') ? apiConfig.baseUrl.slice(0, -1) : apiConfig.baseUrl;
  const targetPath = path.startsWith('/') ? path : `/${path}`;
  return `${root}${targetPath}`;
};

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  let parsedBody: unknown;

  try {
    parsedBody = await response.json();
  } catch {
    throw new Error('API response is not valid JSON.');
  }

  if (!response.ok) {
    const fallbackMessage = `Request failed (${response.status})`;
    const apiError =
      typeof parsedBody === 'object' && parsedBody !== null
        ? (parsedBody as Record<string, unknown>).detail
        : undefined;

    if (typeof apiError === 'string') {
      throw new Error(apiError);
    }

    if (typeof apiError === 'object' && apiError !== null && 'error' in apiError) {
      const nestedError = (apiError as { error?: { message?: string } }).error?.message;
      throw new Error(nestedError ?? fallbackMessage);
    }

    throw new Error(fallbackMessage);
  }

  return parsedBody as T;
};

const fetchWithTimeout = async <T>(path: string): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(buildEndpoint(path), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    return await parseJsonResponse<T>(response);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout. Vui lòng thử lại.');
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const getScheduleSnapshot = async (): Promise<SnapshotData> => {
  const response = await fetchWithTimeout<ScheduleSnapshotResponse>('/schedule/snapshot');

  if (!response.success || !response.data) {
    throw new Error('API trả về dữ liệu lịch không hợp lệ.');
  }

  return response.data;
};
