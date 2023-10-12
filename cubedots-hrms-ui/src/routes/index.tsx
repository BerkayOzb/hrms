// import React from 'react';

import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

export default function Routes() {
  return useRoutes([MainRoutes, LoginRoutes]);
}
