//Este componente esta pensado para ser reutilizado, donde vos importar la tabla y le pasas los parametros que necesites.
//El ejemplo se llama "EJEMPLO_TABLA.JSX"
import React from "react";
const TablaReutilizable = ({ datos, columnas }) => {
    
  return (
    <table className="tabla-reutilizable">
      <thead>
        <tr>
          {columnas.map((columna, index) => (
            <th key={index}>{columna.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {datos.map((fila, indexFila) => (
          <tr key={indexFila}>
            {columnas.map((columna, indexCol) => (
              <td key={indexCol}>
                {columna.render ? columna.render(fila) : fila[columna.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaReutilizable;