import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import loginService from "../services/loginService";

const Login = () => {
    const navigate = useNavigate();

    const [Documento, setDocumento] = useState("");
    const [Contrasena, setContrasena] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                Documento: Documento.trim(),
                Contrasena: Contrasena.trim(),
            };

            const result = await loginService(payload);

            console.log("RESPUESTA DEL BACK:", result);

            // ⛔ Validación correcta para objeto (no array)
            if (!result || !result.datosAlumno || typeof result.datosAlumno !== "object") {
                return Swal.fire("Error", "Credenciales incorrectas.", "error");
            }

            const alumno = result.datosAlumno;

            Swal.fire({
                icon: "success",
                title: "Bienvenido",
                text: `Hola ${alumno.Nombre}!`,
                timer: 1500,
                showConfirmButton: false,
            });

            // Guardamos sesión
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("datosAlumno", JSON.stringify(result.datosAlumno));
            localStorage.setItem("datosCarrera", JSON.stringify(result.datosCarrera));

            setTimeout(() => navigate("/"), 1200);

        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Error al conectar con el servidor.", "error");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>

                <div className="form-group">
                    <label>DNI:</label>
                    <input
                        type="number"
                        value={Documento}
                        onChange={(e) => setDocumento(e.target.value)}
                        placeholder="Ingresa tu DNI"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={Contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>

                <button type="submit" className="login-button">
                    Ingresar
                </button>
            </form>
        </div>
    );
};

export default Login;
