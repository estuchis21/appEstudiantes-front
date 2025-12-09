import { useEffect, useState } from "react";
import { FaClipboardUser } from "react-icons/fa6";
import { MdContacts } from "react-icons/md";
import Swal from 'sweetalert2';
import { editDatos } from "../services/userService";
import "../Styles/Datos.css";

const DatosUser = () => {
  const [usuario, setUsuario] = useState(null);
  const [carreras, setCarreras] = useState([]);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [formData, setFormData] = useState({
    Telefono: "",
    Correo: "",
    Domicilio: ""
  });

  useEffect(() => {
    try {
      const dataUser = JSON.parse(localStorage.getItem("userData"));

      // 🔥 ahora tomamos TODAS las carreras, no solo una
      const dataCareer = JSON.parse(localStorage.getItem("carrerasVigentes")) || [];
      const listaCarreras = Array.isArray(dataCareer) ? dataCareer : [dataCareer];

      setUsuario(dataUser || null);
      setCarreras(listaCarreras);

      if (dataUser) {
        setFormData({
          Telefono: dataUser.Telefono || "",
          Correo: dataUser.Correo || "",
          Domicilio: dataUser.Domicilio || ""
        });
      }

    } catch (error) {
      console.error("❌ Error cargando datos:", error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const mostrarConfirmacion = async () => {
    const cambios = [];

    if (formData.Telefono !== usuario.Telefono) cambios.push(`Teléfono: ${usuario.Telefono || "No especificado"} → ${formData.Telefono}`);
    if (formData.Correo !== usuario.Correo) cambios.push(`Email: ${usuario.Correo || "No especificado"} → ${formData.Correo}`);
    if (formData.Domicilio !== usuario.Domicilio) cambios.push(`Dirección: ${usuario.Domicilio || "No especificado"} → ${formData.Domicilio}`);

    if (cambios.length === 0) {
      await Swal.fire({ icon: 'info', title: 'Sin cambios', text: 'No se detectaron cambios para guardar.' });
      return false;
    }

    const result = await Swal.fire({
      title: '¿Confirmar cambios?',
      html: `<ul>${cambios.map(c => `<li>${c}</li>`).join('')}</ul>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745'
    });

    if (result.isConfirmed) handleGuardarCambios();
  };

  const handleGuardarCambios = async () => {
    try {
      await editDatos(formData.Telefono, formData.Correo, formData.Domicilio, usuario.Permiso);

      const usuarioActualizado = { ...usuario, ...formData };
      localStorage.setItem("userData", JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);

      Swal.fire({ icon: 'success', title: 'Cambios guardados', timer: 2000 });

      setEditando(false);
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Error al guardar' });
    }
  };

  if (!usuario) return <div className="datos-personales-container"><div className="cargando">Cargando datos del usuario...</div></div>;

  return (
    <div className="datos-personales-container">
      <h1 className="datos-personales-title">Datos Personales</h1>

      <div className="datos-personales-content">

        {/* Información Personal */}
        <div className="datos-section">
          <h2><FaClipboardUser/> Información Personal</h2>
          <div className="datos-item"><strong className="datos-label">Nombre:</strong> <span className="datos-value">{usuario.Nombre}</span></div>
          <div className="datos-item"><strong className="datos-label">Documento:</strong> <span className="datos-value">{usuario.Documento}</span></div>
          <div className="datos-item"><strong className="datos-label">Localidad:</strong> <span className="datos-value">{usuario.Localidad || "No especificado"}</span></div>
          <div className="datos-item"><strong className="datos-label">Estado:</strong> <span className="datos-value">{usuario.BloquearAutogestion === "0" ? "Activo" : "Bloqueado"}</span></div>
        </div>

        {/* Carreras - 🔥 Ahora muestra TODAS mapeadas */}
        <div className="datos-section">
          <h2>🎓 Información Académica</h2>

          {carreras.length > 0 ? carreras.map((c, idx) => (
            <div key={idx} className="carrera-item">
              <div className="datos-item"><strong className="datos-label">Carrera:</strong> <span className="datos-value">{c.Nombre}</span></div>
              <div className="datos-item"><strong className="datos-label">Año de Ingreso:</strong> <span className="datos-value">{c.Ingreso}</span></div>
              <div className="datos-item"><strong className="datos-label">Código de Carrera:</strong> <span className="datos-value">{c.Codigo}</span></div>
              <hr/>
            </div>
          )) : <p>No hay carreras vinculadas.</p>}
        </div>

        {/* Información de contacto */}
        <div className="datos-section">
          <h2><MdContacts /> Información de Contacto</h2>
          <form onSubmit={(e) => { e.preventDefault(); mostrarConfirmacion(); }}>

            <div className="datos-item">
              <strong className="datos-label">Teléfono:</strong>
              {editando ? <input type="text" name="Telefono" value={formData.Telefono} onChange={handleInputChange} className="datos-value editing" /> : <span className="datos-value">{usuario.Telefono || "No especificado"}</span>}
            </div>

            <div className="datos-item">
              <strong className="datos-label">Email:</strong>
              {editando ? <input type="email" name="Correo" value={formData.Correo} onChange={handleInputChange} className="datos-value editing" /> : <span className="datos-value">{usuario.Correo || "No especificado"}</span>}
            </div>

            <div className="datos-item">
              <strong className="datos-label">Dirección:</strong>
              {editando ? <input type="text" name="Domicilio" value={formData.Domicilio} onChange={handleInputChange} className="datos-value editing" /> : <span className="datos-value">{usuario.Domicilio || "No especificado"}</span>}
            </div>

            <div className="flex-buttons">
              {!editando ? (
                <button type="button" className="datos-editar-btn" onClick={() => setEditando(true)}>Editar Datos</button>
              ) : (
                <>
                  <button type="submit" className={`datos-editar-btn ${cargando ? 'guardando' : ''}`} disabled={cargando}>{cargando ? "Guardando..." : "Guardar Cambios"}</button>
                  <button type="button" className="datos-editar-btn cancelar" onClick={() => setEditando(false)} disabled={cargando}>Cancelar</button>
                </>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default DatosUser;
