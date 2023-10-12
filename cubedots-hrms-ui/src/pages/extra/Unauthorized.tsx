import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate('/home'); 
  };

  const goToLoginPage = () => {
    navigate('/login'); 
  };

  return (
    <div>
      <h1>Not Authorized</h1>
      <p>You are not authorized to view this page.</p>
      <Button variant="contained" color="primary" onClick={goToHomePage}>
        Go to Home
      </Button>
      <Button variant="contained" color="secondary" onClick={goToLoginPage}>
        Go to Login
      </Button>
    </div>
  );
};

export default NotAuthorized;
