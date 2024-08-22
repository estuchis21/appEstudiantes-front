import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './pages/Login/Login.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*Aca llamamos al componente del Main*/}
    <Login />
  </React.StrictMode>,
)
