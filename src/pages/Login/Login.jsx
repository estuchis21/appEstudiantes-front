// Importamos useState desde React para manejar el estado local en el componente
import React, { useState } from 'react';
// Importamos componentes de React Bootstrap para estructurar y estilizar el formulario
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// Importamos los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import App from '../../App.jsx';
// Importamos la función de login desde el archivo loginService.js
import loginService from '../../services/loginService';

// Definimos un componente funcional llamado Login utilizando una arrow function
const Login = () => {
  // Declaramos estados locales para manejar los inputs del formulario y el estado de la sesión
  const [Documento, setUsuario] = useState('');
  const [Contrasena, setClave] = useState('');
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { Documento, Contrasena };

  
    try {

      const result = await loginService(data);

      if (result.documento) {
        const documento = JSON.stringify(result.documento);
        const nombre = JSON.stringify(result.nombre);
        localStorage.setItem('documento', documento); // Guarda el documento aquí
        localStorage.setItem('nombre', nombre); // Guarda el documento aquí
        setLoginSuccessful(true);

      } else {
        setErrorMessage('Usuario o clave incorrecta');
      }
    } catch (error) {
      setErrorMessage('Error durante el login');
    }
  };

  // Retornamos el JSX para renderizar el componente
  return (
    <>
       {/* Si el login no es exitoso, mostramos el formulario de login */}
       {loginSuccessful ? (
        // Si el login es exitoso, mostramos el componente APP
        <App/>
      ) : (
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={5}>
              <div className="p-4 rounded shadow">
                <h2 className="text-center mb-4">Iniciar Sesión</h2>
                {/* Si hay un mensaje de error, lo mostramos */}
                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                <Form onSubmit={handleLogin}>
                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>Documento</Form.Label>
                    <Form.Control
                      onChange={(event) => setUsuario(event.target.value)}
                      type="text"
                      placeholder="Documento"
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Label>Clave</Form.Label>
                    <Form.Control
                      onChange={(event) => setClave(event.target.value)}
                      type="password"
                      placeholder="Clave"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mb-3 mx-auto d-block">
                    Iniciar Sesión
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>    
      )}
    </>
  );
};

// Exportamos el componente Login para que pueda ser utilizado en otros archivos
export default Login;