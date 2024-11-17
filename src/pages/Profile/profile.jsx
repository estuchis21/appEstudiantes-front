import { React, useState } from "react";
import { Container, Button } from "react-bootstrap";
import ChangePass from '../../components/Profile/ChangePass';
import { editDatos } from "../../services/userService";

const Profile = () => {
    const [nombre, setNombre] = useState(localStorage.getItem("nombre") || "");
    const [dni, setDni] = useState(localStorage.getItem("documento") || "");
    const [domicilio, setDomicilio] = useState(localStorage.getItem("domicilio") || "");
    const [localidad, setLocalidad] = useState(localStorage.getItem("localidad") || "");
    const [telefono, setTelefono] = useState(localStorage.getItem("telefono") || "");
    const [correo, setCorreo] = useState(localStorage.getItem("correo") || "");
    const permiso =  localStorage.getItem('permiso');
    const [errorMessage, setErrorMessage] = useState('');
    
    const [isEditing, setIsEditing] = useState(false); // Controla el modo de edición
    const [showEditModal, setShowEditModal] = useState(false); // Controla la visibilidad del modal de cambio de contraseña

    // Función para activar el modo de edición
    const handleEditDataClick = () => {
        setIsEditing(true);
    };

    // Función para guardar los cambios
    const handleSaveClick = async () => {
        console.log(permiso);
        const editarUsuario = await editDatos(domicilio,correo,telefono, permiso);
        if(editarUsuario){
            localStorage.setItem("domicilio", domicilio);
            localStorage.setItem("telefono", telefono);
            localStorage.setItem("correo", correo);
            setIsEditing(false);
            setErrorMessage('Datos del usuario editados correctamente');
        } else{
            setErrorMessage('Error al editar datos del usuario');
        }

        // Oculta el mensaje después de 2 segundos
        setTimeout(() => {
            setErrorMessage('');
        }, 2000);
    };

    // Función para abrir el modal de cambio de contraseña
    const handleEditClick = () => {
        setShowEditModal(true);
    };

    // Función para cerrar el modal de cambio de contraseña
    const handleCloseEdit = () => {
        setShowEditModal(false);
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <form className="w-100" style={{ maxWidth: "600px" }}>
                <div className="row d-flex align-items-center text-center">
                    {/* Si hay un mensaje de error, lo mostramos */}
                    {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                    <div className="row bg-secondary bg-gradient py-2">
                        <div className="col-md-6 col-12 text-md-end">
                            <label className="fw-bold">Nombre</label>
                        </div>
                        <div className="col-md-6 col-12 text-md-start">
                            <input
                                type="text"
                                value={nombre}
                                disabled
                                className="form-control form-control-sm"
                            />
                        </div>
                    </div>
                
                    <div className="row py-2">
                        <div className="col-md-6 col-12 text-md-end">
                            <label className="fw-bold">Documento</label>
                        </div>
                        <div className="col-md-6 col-12 text-md-start">
                            <input
                                type="text"
                                value={dni}
                                disabled
                                className="form-control form-control-sm"
                            />
                        </div>
                    </div>

                    <div className="row bg-secondary bg-gradient py-2">
                        <div className="col-md-6 col-12 text-md-end">
                            <label className="fw-bold">Domicilio</label>
                        </div>
                        <div className="col-md-6 col-12 text-md-start">
                            <input
                                type="text"
                                value={domicilio}
                                onChange={(e) => setDomicilio(e.target.value)}
                                disabled={!isEditing}
                                className="form-control form-control-sm"
                            />
                        </div>
                    </div>

                    <div className="row py-2">
                        <div className="col-md-6 col-12 text-md-end">
                            <label className="fw-bold">Localidad</label>
                        </div>
                        <div className="col-md-6 col-12 text-md-start py-1">
                            <input
                                type="text"
                                value={localidad}
                                disabled
                                className="form-control form-control-sm"
                            />
                        </div>
                    </div>

                    <div className=" row bg-secondary bg-gradient py-2">
                        <div className="col-md-6 col-12 text-md-end">
                            <label className="fw-bold">Telefono</label>
                        </div>
                        <div className="col-md-6 col-12 text-md-start">
                            <input
                                type="text"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                disabled={!isEditing}
                                className="form-control form-control-sm"
                            />
                        </div>
                    </div>

                    <div className="row py-2">
                        <div className="col-md-6 col-12 text-md-end py-2">
                            <label className="fw-bold">Correo</label>
                        </div>
                        <div className="col-md-6 col-12 text-md-start py-1 mt-1">
                            <input
                                type="text"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                disabled={!isEditing}
                                className="form-control form-control-sm"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center mt-2">
                            {!isEditing ? (
                                <Button variant="primary" className="m-1 btn-sm" onClick={handleEditDataClick}>
                                    Modificar datos
                                </Button>
                            ) : (
                                <Button variant="success" className="m-1 btn-sm" onClick={handleSaveClick}>
                                    Guardar cambios
                                </Button>
                            )}
                            <Button variant="primary" className="m-1 btn-sm" onClick={handleEditClick}>
                                Cambiar contraseña
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Modal para Cambiar clave */}
                <ChangePass
                    show={showEditModal}
                    onCreate={handleEditClick}
                    onClose={handleCloseEdit}
                />
            </form>
        </Container>
    );
};

export default Profile;
