import React from 'react';
import { Helmet } from 'react-helmet';

const MetaHead = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title || 'Notes App'}</title>
      <meta name="description" content={description || 'A simple notes application'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
  );
};

export default MetaHead;
