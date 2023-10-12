import React from 'react';
import Login from '../pages/authentication/Login';
import MinimalLayout from '../layout/MinimalLayout';
import EmailVerification from '../pages/authentication/EmailVerification';
import ForgetPassword from '../pages/authentication/ForgetPassword';

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <Login/>
    },
    {
      path: 'verify-email',
      element:<EmailVerification/>
    },
    {
      path: 'forgot-password',
      element:<ForgetPassword/>
    }
  ]
};

export default LoginRoutes;
