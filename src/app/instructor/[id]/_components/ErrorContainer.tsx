'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface ErrorContainerProps {
  toastMessage: string;
  children: React.ReactNode;
}

const ErrorContainer = ({ children, toastMessage }: ErrorContainerProps) => {
  useEffect(() => {
    toast.error(toastMessage);
  }, [toastMessage]);

  return <>{children}</>;
};

export default ErrorContainer;
