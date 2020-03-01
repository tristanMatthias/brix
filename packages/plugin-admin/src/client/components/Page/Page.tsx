import './page.scss';

import React, { useEffect } from 'react';


export interface PageProps {
  title: string;
  type?: string;
}

export const Page: React.FunctionComponent<PageProps> = ({
  title,
  type,
  children
}) => {
  useEffect(() => { document.title = title; }, [title]);

  return <main className={type}>{children}</main>;
};


export const PageContent: React.FunctionComponent = ({ children }) =>
  <div className="page-content">{children}</div>;
