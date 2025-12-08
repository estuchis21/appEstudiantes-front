import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const CareerSelector = () => {
    const [carreras, setCarreras] = useState([]);
    const [carreraActual, setCarreraActual] = useState(null);

    useEffect(() => {
        const carrerasGuardadas = JSON.parse(localStorage.getItem("carrerasVigentes")) || [];
        const actual = JSON.parse(localStorage.getItem("careerData")) || {};

        setCarreras(carrerasGuardadas);
        setCarreraActual(actual);
    }, []);

    const handleCambioCarrera = (e) => {
        const codigoSeleccionado = Number(e.target.value);
        const nuevaCarrera = carreras.find(c => c.Codigo === codigoSeleccionado);

        if (nuevaCarrera) {
            localStorage.setItem("careerData", JSON.stringify(nuevaCarrera));
            setCarreraActual(nuevaCarrera);

            Swal.fire({
                title: 'Cambiando de carrera...',
                text: `Has seleccionado: ${nuevaCarrera.Nombre}`,
                timer: 1500,
                showConfirmButton: false,
                icon: 'success'
            }).then(() => {
                window.location.reload();
            });
        }
    };

    // if (carreras.length <= 1) return null;

    return (
        <div className="career-selector-container" style={{ margin: "1rem 0", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #dee2e6" }}>
            <label htmlFor="career-select" style={{ marginRight: "10px", fontWeight: "bold" }}>Carrera:</label>
            <select
                id="career-select"
                value={carreraActual?.Codigo || ""}
                onChange={handleCambioCarrera}
                style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ced4da", width: "100%", maxWidth: "400px" }}
            >
                {carreras.map((c) => (
                    <option key={c.Codigo} value={c.Codigo}>
                        {c.Nombre} (Plan {c.Ingreso})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CareerSelector;
