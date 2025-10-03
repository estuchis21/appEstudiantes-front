// pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginService from "../services/loginService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [Documento, setDocumento] = useState("");
  const [Contrasena, setContrasena] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginService({
        Documento: String(Documento).trim(),
        Contrasena: Contrasena.trim(),
      });


      // Ahora retornar el objeto del usuario logueado.
      const usuario = response.datosAlumno;

      if (usuario) {
        // Guardar login en localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("usuario", JSON.stringify(usuario));


        // Redirigir a home
        navigate("/");
        window.location.reload();
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <div className="form-group">
          <label>DNI:</label>
          <input
            type="text"
            value={Documento}
            onChange={(e) => setDocumento(e.target.value)}
            required
            autoComplete="dni"
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={Contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="login-button">
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
