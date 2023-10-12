import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate('/home'); 
  };

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button variant="contained" color="primary" onClick={goToHomePage}>
        Go to Home
      </Button>
    </div>
  );
};

export default NotFound;
