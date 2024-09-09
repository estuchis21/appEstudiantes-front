import React from 'react';
// Importamos componentes de React Bootstrap para estructurar y estilizar el formulario
import { Container, Row, Col, Button } from 'react-bootstrap';
// Importamos los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

const handleLogout = async (e) => {
  localStorage.removeItem('documento');
  window.location.reload();

};

const Home = () => {
  //traemos el documento guardado en la variable
  const nombre = localStorage.getItem('nombre');

  return (
    <Container className="mt-5">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={5}>
              <div className="p-4 rounded shadow">
                <h2 className="text-center mb-4">Bienvenido al Home</h2>
                  <p className="text-center m-4">Usuario ingresado: {nombre} </p>

                   {/* Conectamos el botón con la función handleLogout */}
                <Button variant="primary" onClick={handleLogout} className="mb-3 mx-auto d-block">
                  Cerrar Sesión
                </Button>
              </div>
            </Col>
          </Row>
        </Container>    
  );
};
export default Home;