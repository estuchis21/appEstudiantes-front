import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import SidebarMenu from './components/Sidebar/SidebarNew'; // Importa el Sidebar
import ListCourses from './pages/Courses/ListCourses';


const App = () => {
  const [loginSuccessful, setLoginSuccessful] = useState(localStorage.getItem('documento'));

  return (
    <div className="App">
      <Router>
        <div className="d-flex">
          {/* Muestra el Sidebar si el usuario ha iniciado sesión */}
          {loginSuccessful && <SidebarMenu setLoginSuccessful={setLoginSuccessful} />}
          <div className="flex-grow-1 p-3"> {/* Flex para que el contenido principal ocupe el resto de la pantalla */}
            <Routes>
              <Route path="/" element={loginSuccessful ? <Home /> : <Navigate to="/login" />} />
              <Route path="/login" element={!loginSuccessful ? <Login setLoginSuccessful={setLoginSuccessful} /> : <Navigate to="/" />} />
              <Route path="/cursadas" element={<ListCourses/>} />
              {/* Otras rutas van aquí */}
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;