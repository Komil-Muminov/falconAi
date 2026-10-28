import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import React, { useState } from 'react';

interface IProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<IProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1
          }
        }
      })
  );

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#0284c7',
          borderRadius: 10,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 14
        },
        components: {
          Button: {
            controlHeight: 38,
            borderRadius: 8
          },
          Input: {
            controlHeight: 42,
            borderRadius: 8
          },
          Select: {
            controlHeight: 42,
            borderRadius: 8
          },
          Table: {
            borderRadius: 12,
            headerBg: '#f8fafc',
            headerColor: '#475569'
          }
        }
      }}
    >
      <AntdApp>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
};
