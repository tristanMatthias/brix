import './app-grid.scss';

import React from 'react';

import { Picker } from '../Picker/Picker';
import { Sidebar } from '../Sidebar/Sidebar';

export const AppGrid: React.FunctionComponent = ({ children }) => {
  return <div className="app-grid">
    <Picker />
    <Sidebar />
    {children}
  </div>;
};
