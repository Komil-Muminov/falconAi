import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TCacheKeys } from '../config/cache-keys';

type THttpMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface IUseMutationQueryOptions<TData, TVariables> {
  url: string | ((variables: TVariables) => string);
  method?: THttpMethod;
  invalidateKeys?: TCacheKeys[];
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

export const useMutationQuery = <TData = unknown, TVariables = unknown>({
  url,
  method = 'POST',
  invalidateKeys,
  onSuccess,
  onError
}: IUseMutationQueryOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const targetUrl = typeof url === 'function' ? url(variables) : url;

      const isBodyAllowed = method !== 'DELETE' || (variables && typeof variables === 'object');
      const body = isBodyAllowed && variables ? JSON.stringify(variables) : undefined;

      const response = await fetch(targetUrl, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body
      });

      if (!response.ok) {
        let errorMessage = 'Ошибка при выполнении операции';
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
    onSuccess: (data, variables) => {
      if (invalidateKeys && invalidateKeys.length > 0) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      onError?.(error, variables);
    }
  });
};
