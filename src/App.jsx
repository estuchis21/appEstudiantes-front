import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';

const App = () => {
//Aca utlizamos la variable documento, si no es null es pq era iniciado
  const [loginSuccessful, setLoginSuccessful] = useState(localStorage.getItem('documento'));
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={loginSuccessful ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!loginSuccessful ? <Login setLoginSuccessful={setLoginSuccessful} /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;