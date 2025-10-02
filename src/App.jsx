import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const App = () => {
  // Simulación de login exitoso (puedes cambiar a false para probar el redirect)
  const [loginSuccessful] = useState(true);

  return (
    <div className="App">
      <Router>
        <Header />
        <Sidebar />
        <div className='main-content'>
        <Routes>
          <Route path="/" element={loginSuccessful ? <Home /> : <Navigate to="/login" />} />
        </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;