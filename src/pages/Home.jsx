import React from "react";
import { SiMoodle } from "react-icons/si";

const Home = () => {
    return (
        <div>
            <h1>Bienvenido "Usuario"!</h1>
                <a href="http://moodle.isfdyt20.edu.ar/" className="Moodle-Text">
                <SiMoodle /><p>Ir a moodle</p></a>
        </div>
    );
}   

export default Home;