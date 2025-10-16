import React, { useState, useEffect } from "react";
import { editDatos } from "../services/userService";
import Swal from 'sweetalert2';

const DatosUser = () => {
  const [usuario, setUsuario] = useState(null);
  const [carrera, setCarrera] = useState(null);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [formData, setFormData] = useState({
    Telefono: "",
    Correo: "",
    Domicilio: ""
  });

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = () => {
    try {
      const usuarioStorage = localStorage.getItem("usuario");
      const datosCarreraStorage = localStorage.getItem("datosCarrera");

      if (usuarioStorage) {
        const usuarioData = JSON.parse(usuarioStorage);
        console.log("👤 Usuario parseado:", usuarioData);
        setUsuario(usuarioData);
        setFormData({
          Telefono: usuarioData.Telefono || "",
          Correo: usuarioData.Correo || "",
          Domicilio: usuarioData.Domicilio || ""
        });
      }

      if (datosCarreraStorage) {
        const carreraData = JSON.parse(datosCarreraStorage);
        setCarrera(carreraData);
      }
    } catch (error) {
      console.error("❌ Error cargando datos del usuario:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const mostrarConfirmacion = async () => {
    const cambios = [];
    
    if (formData.Telefono !== usuario.Telefono) {
      cambios.push(`Teléfono: ${usuario.Telefono || "No especificado"} → ${formData.Telefono}`);
    }
    if (formData.Correo !== usuario.Correo) {
      cambios.push(`Email: ${usuario.Correo || "No especificado"} → ${formData.Correo}`);
    }
    if (formData.Domicilio !== usuario.Domicilio) {
      cambios.push(`Dirección: ${usuario.Domicilio || "No especificado"} → ${formData.Domicilio}`);
    }

    if (cambios.length === 0) {
      await Swal.fire({
        icon: 'info',
        title: 'Sin cambios',
        text: 'No se detectaron cambios para guardar.',
        confirmButtonColor: '#667eea',
      });
      return false;
    }

    const cambiosHTML = cambios.map(cambio => `<li>${cambio}</li>`).join('');

    const result = await Swal.fire({
      title: '¿Confirmar cambios?',
      html: `
        <div style="text-align: left;">
          <p>Se modificarán los siguientes datos:</p>
          <ul style="padding-left: 20px; margin: 10px 0;">
            ${cambiosHTML}
          </ul>
          <p style="color: #666; font-size: 0.9em; margin-top: 15px;">
            ¿Deseas continuar?
          </p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return handleGuardarCambios();
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

    return result.isConfirmed;
  };

  const handleGuardarCambios = async () => {
    try {
      if (!usuario?.Permiso) {
        throw new Error("No se encontró el permiso del usuario");
      }

      await editDatos(
        formData.Telefono,
        formData.Correo,
        formData.Domicilio,
        usuario.Permiso
      );

      const usuarioActualizado = {
        ...usuario,
        Telefono: formData.Telefono,
        Correo: formData.Correo,
        Domicilio: formData.Domicilio
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);

      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Tus datos han sido actualizados correctamente.',
        confirmButtonColor: '#28a745',
        timer: 3000,
        timerProgressBar: true,
      });

      setEditando(false);
      return true;

    } catch (error) {
      console.error("❌ Error actualizando datos:", error);
      
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        html: `
          <div style="text-align: left;">
            <p>No se pudieron guardar los cambios:</p>
            <p style="color: #dc3545; font-weight: bold; margin-top: 10px;">
              ${error.message || "Error al actualizar los datos"}
            </p>
          </div>
        `,
        confirmButtonColor: '#dc3545',
      });
      
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      await mostrarConfirmacion();
    } catch (error) {
      console.error("Error en el proceso de confirmación:", error);
    } finally {
      setCargando(false);
    }
  };

  const cancelarEdicion = async () => {
    const hasChanges = 
      formData.Telefono !== usuario.Telefono ||
      formData.Correo !== usuario.Correo ||
      formData.Domicilio !== usuario.Domicilio;

    if (hasChanges) {
      const result = await Swal.fire({
        title: '¿Descartar cambios?',
        text: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres cancelar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, descartar',
        cancelButtonText: 'Seguir editando',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    if (usuario) {
      setFormData({
        Telefono: usuario.Telefono || "",
        Correo: usuario.Correo || "",
        Domicilio: usuario.Domicilio || ""
      });
    }
    setEditando(false);
  };

  if (!usuario) {
    return (
      <div className="home-user-container">
        <div className="cargando">Cargando datos del usuario...</div>
      </div>
    );
  }

  return (
    <div className="home-user-container">
      <div className="home-user-header">
        <h1>Datos Personales</h1>
        <p className="user-email">Gestión de información personal</p>
      </div>

      <div className="home-user-grid">
        <div className="home-user-column">
          <div className="home-user-card">
            <h2>📊 Información Personal</h2>
            <div className="datos-item">
              <strong>Nombre:</strong>
              <span>{usuario.Nombre}</span>
            </div>
            <div className="datos-item">
              <strong>Documento:</strong>
              <span>{usuario.Documento}</span>
            </div>
            <div className="datos-item">
              <strong>Localidad:</strong>
              <span>{usuario.Localidad || "No especificado"}</span>
            </div>
            <div className="datos-item">
              <strong>Estado:</strong>
              <span>{usuario.BloquearAutogestion === "0" ? "Activo" : "Bloqueado"}</span>
            </div>
          </div>

          {carrera && (
            <div className="home-user-card">
              <h2>🎓 Información Académica</h2>
              <div className="datos-item">
                <strong>Carrera:</strong>
                <span>{carrera.Nombre}</span>
              </div>
              <div className="datos-item">
                <strong>Año de Ingreso:</strong>
                <span>{carrera.Ingreso}</span>
              </div>
              <div className="datos-item">
                <strong>Código de Carrera:</strong>
                <span>{carrera.Codigo}</span>
              </div>
            </div>
          )}
        </div>

        <div className="home-user-column">
          <div className="home-user-card">
            <div className="card-header">
              <h2>📞 Información de Contacto</h2>
              {!editando && (
                <button 
                  type="button"
                  className="Button-Login"
                  onClick={() => setEditando(true)}
                >
                  ✏️ Editar
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="datos-item">
                <strong>Teléfono:</strong>
                {editando ? (
                  <input
                    type="text"
                    name="Telefono"
                    value={formData.Telefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 2364444444"
                    className="form-input"
                  />
                ) : (
                  <span>{usuario.Telefono || "No especificado"}</span>
                )}
              </div>

              <div className="datos-item">
                <strong>Email:</strong>
                {editando ? (
                  <input
                    type="email"
                    name="Correo"
                    value={formData.Correo}
                    onChange={handleInputChange}
                    placeholder="Ej: micorreo@instituto20.com.ar"
                    className="form-input"
                  />
                ) : (
                  <span>{usuario.Correo || "No especificado"}</span>
                )}
              </div>

              <div className="datos-item">
                <strong>Dirección:</strong>
                {editando ? (
                  <input
                    type="text"
                    name="Domicilio"
                    value={formData.Domicilio}
                    onChange={handleInputChange}
                    placeholder="Ej: Almafuerte 300"
                    className="form-input"
                  />
                ) : (
                  <span>{usuario.Domicilio || "No especificado"}</span>
                )}
              </div>

              {editando && (
                <div className="botones-container">
                  <button 
                    type="submit" 
                    className="cta-button"
                    disabled={cargando}
                  >
                    {cargando ? "🔄 Procesando..." : "💾 Guardar Cambios"}
                  </button>
                  <button 
                    type="button"
                    className="cta-secondary"
                    onClick={cancelarEdicion}
                    disabled={cargando}
                  >
                    ❌ Cancelar
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosUser;