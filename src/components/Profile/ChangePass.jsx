import React, { useState } from 'react';
import { Modal, Button, Form , InputGroup , Alert} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePass = ({ show, onClose, onCreate }) => {
    const [newClave, setnewClave] = useState({
        claveActual: '',
        claveNueva: '',
        claveConfir: ''
    })
    const [showPassword, setShowPassword] = useState(false); // Estado para manejar la visibilidad de la contraseña
    const [showSuccess, setShowSuccess] = useState(false); // Estado para manejar el mensaje de cambios guardados
    
    // Función para manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const {name, value} = e.target;
        setnewClave({ ...newClave, [name]: value });
    };

     // Función para guardar los cambios y llamar a la función 'onCreate' pasada como prop
     const handleEditPass = async () => {
        //const editarClaves = await editarClave(newClave);
        if(editarClaves){
            setShowSuccess(true); // Muestra la alerta
            setTimeout(() => {
                setShowSuccess(false); // Oculta la alerta después de 2 segundos
                onCreate(editarClave); // Llama a onCreate con el nuevo usuario creado
                onClose();//Cierra el modal
            },900);
            
            
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
                        Clave cambiada con éxito.
                    </Alert>
                )}
                <Form>
                    {/* Campo de formulario para el nombre del usuario */}
                    <Form.Group>
                        <Form.Label>Contraseña Actual</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    name="claveActual"
                                    value={newClave.claveActual}
                                    aria-describedby="password-addon"
                                    onChange={handleChange}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={togglePasswordVisibility}
                                    id="password-addon"
                                >   
                                    {/* Mostrar "Ocultar" si la contraseña está visible, de lo contrario, mostrar "Mostrar" */}
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                        </InputGroup>
                    </Form.Group>
                    {/* Campo de formulario para el usuario del usuario */}
                    <Form.Group>
                        <Form.Label>Nueva Contraseña</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    name="claveNueva"
                                    value={newClave.claveNueva}
                                    aria-describedby="password-addon"
                                    onChange={handleChange}
                                />

                                <Button
                                    variant="outline-secondary"
                                    onClick={togglePasswordVisibility}
                                    id="password-addon"
                                >   
                                    {/* Mostrar "Ocultar" si la contraseña está visible, de lo contrario, mostrar "Mostrar" */}
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                            </InputGroup>
                    </Form.Group>
                    {/* Campo de formulario para la password del usuario */}
                    <Form.Group>
                        <Form.Label>Confirmar Contraseña</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                name="claveConfir"
                                value={newClave.claveConfir}
                                onChange={handleChange}
                                aria-describedby="password-addon"
                            />
                            
                            <Button
                                variant="outline-secondary"
                                onClick={togglePasswordVisibility}
                                id="password-addon"
                            >   
                                {/* Mostrar "Ocultar" si la contraseña está visible, de lo contrario, mostrar "Mostrar" */}
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                            
                        </InputGroup>
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