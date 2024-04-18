'use client';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { reloadToast } from '@/utils/reloadMessage';
import { accessTokenReissuance } from '../apis/userApi';
import { FetchError } from '@/types/types';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const handleFetchError = async (error: Error) => {
      if (error instanceof Error) {
        const fetchError = error as FetchError;
        switch (fetchError.status) {
          case 401:
            try {
              await accessTokenReissuance();
              queryClient.invalidateQueries();
            } catch (error) {
              reloadToast('로그인 후 이용할 수 있습니다.', 'error');
              console.error(error);
            }
            break;
          default:
            toast.error('잠시후 다시 시도해주세요.');
            console.error(error);
            break;
        }
      }
    };

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 0,
        },
        mutations: {
          onError: handleFetchError,
        },
      },
      queryCache: new QueryCache({
        onError: handleFetchError,
      }),
    });

    return queryClient;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
