import RCTooltip from 'rc-tooltip';
import { TooltipProps as RCTooltipProps } from 'rc-tooltip/lib/Tooltip';
import React from 'react';
import './tooltip.scss';


export interface TooltipProps extends Omit<RCTooltipProps, 'prefixCls'> {
}

export const Tooltip: React.FunctionComponent<TooltipProps> = ({
  children,
  ...props
}) => {
  return <RCTooltip
    trigger="click"
    prefixCls="tooltip"
    {...props}
  >{children}</RCTooltip>;
};

