import React, { useEffect } from 'react';
import './App.css';
import { AuthProvider } from './context/auth';
import Routes from './routes';

function App() {

  return (
    <div className="App">
        <AuthProvider>
          <Routes/>
        </AuthProvider>
    </div>  
  );
}

export default App;
