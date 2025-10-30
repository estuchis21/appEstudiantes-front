// pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginService from "../services/loginService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [Documento, setDocumento] = useState("");
  const [Contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginService({
        Documento: String(Documento).trim(),
        Contrasena: Contrasena.trim(),
      });

      console.log("📦 Response completo del login:", response);

      if (response.permiso) {
        // Guardamos solo el permiso del usuario
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("permiso", response.permiso);

        console.log("🔎 Permiso guardado en localStorage:", response.permiso);

        // Redirigir al home o dashboard
        navigate("/");
      } else {
        alert(response.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("❌ Error en el login:", err);
      alert(err?.response?.data?.error || err.message || "Error en el login");
    } finally {
      setLoading(false);
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
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
