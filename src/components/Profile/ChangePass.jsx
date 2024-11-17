import React, { useState } from 'react';
import { Modal, Button, Form , InputGroup , Alert} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { changePass } from '../../services/userService';

const ChangePass = ({ show, onClose, onCreate }) => {
    const [newClave, setnewClave] = useState({
        permisos: localStorage.getItem('permiso'),
        actPass: '',
        newPass: '',
        passConfir: ''
    })
    const [showPassword, setShowPassword] = useState(false); // Estado para manejar la visibilidad de la contraseña
    const [showSuccess, setShowSuccess] = useState(false); // Estado para manejar el mensaje de cambios guardados
    const [errorMessage, setErrorMessage] = useState("");


    // Función para manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const {name, value} = e.target;
        setnewClave({ ...newClave, [name]: value });
    };

     // Función para guardar los cambios y llamar a la función 'onCreate' pasada como prop
     const handleEditPass = async () => {
        if (newClave.newPass === newClave.passConfir) {
            delete newClave.passConfir; // Elimina el campo passConfir del objeto
            const editarClaves = await changePass(newClave);
            if (editarClaves) {
                setErrorMessage("Contraseña actualizada con éxito");
                setShowAlert(true); // Muestra la alerta de éxito
                setTimeout(() => {
                    setShowAlert(false); // Oculta la alerta después de 2 segundos
                    onCreate(newClave); // Llama a onCreate con el nuevo usuario creado
                    onClose(); // Cierra el modal
                }, 900);
            }
        } else {
            setErrorMessage("Las claves no coinciden"); // Mensaje de error
            setShowAlert(true); // Muestra la alerta de error
            setTimeout(() => {
                setShowAlert(false); // Oculta la alerta después de 2 segundos
            }, 2000);
        }
    };

    // Función para alternar la visibilidad de la contraseña
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Mostrar la alerta si showSuccess es true */}
                {showSuccess && (
                    <Alert variant="success" className="custom-alert">
                        {errorMessage}
                    </Alert>
                )}
                <Form>
                    {/* Campo de formulario para el nombre del usuario */}
                    <Form.Group>
                        <Form.Label>Contraseña Actual</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    name="actPass"
                                    value={newClave.actPass}
                                    aria-describedby="password-addon"
                                    onChange={handleChange}
                                />
                        </InputGroup>
                    </Form.Group>
                    {/* Campo de formulario para el usuario del usuario */}
                    <Form.Group>
                        <Form.Label>Nueva Contraseña</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    name="newPass"
                                    value={newClave.newPass}
                                    aria-describedby="password-addon"
                                    onChange={handleChange}
                                />
                            </InputGroup>
                    </Form.Group>
                    {/* Campo de formulario para la password del usuario */}
                    <Form.Group>
                        <Form.Label>Confirmar Contraseña</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                name="passConfir"
                                value={newClave.passConfir}
                                onChange={handleChange}
                                aria-describedby="password-addon"
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className='mt-2 d-flex justify-content-center align-items-center'>
                        <Button
                            variant="outline-secondary"
                            onClick={togglePasswordVisibility}
                            id="password-addon"
                        >   
                            {/* Mostrar "Ocultar" si la contraseña está visible, de lo contrario, mostrar "Mostrar" */}
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {/* Botón para guardar cambios y cerrar el modal */}
                <Button variant="primary" onClick={handleEditPass}>Guardar</Button>
                {/* Mostrar la alerta si showSuccess es true */}
                {/* Botón para cerrar el modal sin guardar cambios */}
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangePass;