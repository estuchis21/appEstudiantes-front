import Login from "../../pages/Login/Login";
import App from "./../../App.jsx";


// Verificamos que en documento no sea null
let documentoExiste = false;
const documento = localStorage.getItem('documento');
console.log(documento);
if (documento) {
    documentoExiste = true;
    console.log(documento);
}

// Componente principal que muestra Home o Login basado en la existencia del documento
const Main = () => {
    return (
        <>
            {documentoExiste ? <App/> : <Login />} 
        </>
    );
}

export default Main;