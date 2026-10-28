import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TCacheKeys } from '../config/cache-keys';

interface IUseGetQueryOptions<TData> {
  key: TCacheKeys | [TCacheKeys, ...unknown[]];
  url: string;
  params?: Record<string, string | number | undefined | null>;
  enabled?: boolean;
  refetchInterval?: number | false;
  options?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>;
}

export const useGetQuery = <TData>({
  key,
  url,
  params,
  enabled = true,
  refetchInterval = false,
  options
}: IUseGetQueryOptions<TData>) => {
  const queryKey = Array.isArray(key) ? key : [key];

  return useQuery<TData, Error>({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          if (paramValue !== undefined && paramValue !== null && paramValue !== '') {
            queryParams.append(paramKey, String(paramValue));
          }
        });
      }

      const queryString = queryParams.toString();
      const requestUrl = queryString ? `${url}?${queryString}` : url;

      const response = await fetch(requestUrl, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = 'Ошибка сетевого запроса';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    enabled,
    refetchInterval,
    ...options
  });
};
