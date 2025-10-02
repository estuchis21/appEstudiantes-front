import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import HomeUser from './pages/HomeUser';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/Login';
import DatosPersonales from './pages/DatosUser';
import Analitico from './pages/Analitico';
import Asistencias from './pages/Asistencia';
import InscripcionFinales from './pages/Finales';
import Matriculacion from './pages/Matriculacion';


const App = () => {
const [loginSuccessful, setLoginSuccessful] = useState(
  localStorage.getItem('isLoggedIn') === 'true'
);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  

  return (
    <div className="App">
      <Router>
        <Header 
          isLoggedIn={loginSuccessful} 
          toggleSidebar={toggleSidebar}
        />
        {loginSuccessful && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
        <div className='main-content'>
          <Routes>
            <Route path="/" element={loginSuccessful ? <HomeUser /> : <Home/>} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/DatosPersonales" element={<DatosPersonales />} />
            <Route path="/Analitico" element={<Analitico />} />
            <Route path="/Asistencia" element={<Asistencias />} />
            <Route path="/Finales" element={<InscripcionFinales />} />
            <Route path="/Matriculacion" element={<Matriculacion />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;