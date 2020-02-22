import React from 'react';
import classnames from 'classnames';
import { Box, BoxProps } from '../Box/Box';
import './card.scss';


export interface CardProps extends BoxProps { }

export const Card: React.FunctionComponent<CardProps> = ({ className, ...props }) =>
  <Box
    padding={2}
    shadow={2}
    className={classnames('card', className)}
    {...props}
  />;
