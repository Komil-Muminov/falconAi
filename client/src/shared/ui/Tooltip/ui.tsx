import { Tooltip as AntdTooltip, TooltipProps } from 'antd';
import React from 'react';

interface IProps extends TooltipProps {
  children: React.ReactElement;
}

export const Tooltip: React.FC<IProps> = ({ children, ...restProps }) => {
  return <AntdTooltip {...restProps}>{children}</AntdTooltip>;
};
