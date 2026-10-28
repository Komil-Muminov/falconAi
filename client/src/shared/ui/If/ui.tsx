import React from 'react';

interface IProps {
  condition: boolean | unknown;
  children: React.ReactNode;
}

export const If: React.FC<IProps> = ({ condition, children }) => {
  return condition ? <>{children}</> : null;
};
