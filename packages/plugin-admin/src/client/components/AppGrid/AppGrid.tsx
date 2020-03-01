import './app-grid.scss';

import React from 'react';

import { Sidebar } from '../Sidebar/Sidebar';

export const AppGrid: React.FunctionComponent = ({ children }) => {
  return <div className="app-grid">
    <Sidebar />
    {children}
  </div>;
};
