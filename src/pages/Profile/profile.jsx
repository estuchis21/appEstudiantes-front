import React from "react";
import { Container, Button } from "react-bootstrap";

const Profile = () => {
    const nombre = localStorage.getItem("nombre");
    const dni = localStorage.getItem("documento");
    const domicilio = localStorage.getItem("domicilio");
    const localidad = localStorage.getItem("localidad");
    const telefono = localStorage.getItem("telefono");
    const correo = localStorage.getItem("correo");


    return (
        <Container className="d-flex justify-content-center mt-5">
            <form className="w-100" style={{ maxWidth: "600px" }}>
                <div className="row d-flex aling-items-center text-center">
                    <div className="col-md-6 col-12  text-md-end bg-secondary bg-gradient pt-2">
                        <label className="fw-bold">Nombre</label>
                    </div>
                    <div className="col-md-6 col-12 text-md-start bg-secondary bg-gradient pt-2">
                        <p className="fs-5">{nombre}</p>
                    </div>

                    <div className="col-md-6 col-12 text-md-end pt-2">
                        <label className="fw-bold">Documento</label>
                    </div>
                    <div className="col-md-6 col-12 text-md-start pt-2">
                        <p className="fs-5">{dni}</p>
                    </div>

                    <div className="col-md-6 col-12 text-md-end bg-secondary bg-gradient pt-2">
                        <label className="fw-bold">Domicilio</label>
                    </div>
                    <div className="col-md-6 col-12 text-md-start bg-secondary bg-gradient pt-2 pb-2">
                        <input type="text" placeholder={domicilio} disabled />
                    </div>

                    <div className="col-md-6 col-12 text-md-end pt-2">
                        <label className="fw-bold">Localidad</label>
                    </div>
                    <div className="col-md-6 col-12 text-md-start pt-2 pb-2">
                        <input type="text" placeholder="Junin" disabled />
                    </div>

                    <div className="col-md-6 col-12 text-md-end bg-secondary bg-gradient pt-2 pb-2">
                        <label className="fw-bold">Telefono</label>
                    </div>
                    <div className="col-md-6 col-12 text-md-start bg-secondary bg-gradient pt-2 pb-2">
                        <input type="text" placeholder={telefono} disabled />
                    </div>

                    <div className="col-md-6 col-12 text-md-end pt-2">
                        <label className="fw-bold">Correo</label>
                    </div>
                    <div className="col-md-6 col-12 text-md-start pt-2 pb-2">
                    <input type="text" placeholder={correo} disabled />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-center mt-2 ">
                        <Button variant="primary" className="m-1 btn-sm">
                            Modificar datos
                        </Button>
                        <Button variant="primary" className="m-1 btn-sm">
                            Cambiar contraseña
                        </Button>
                    </div>
                </div>
            </form>
        </Container>
    );
};

export default Profile;
