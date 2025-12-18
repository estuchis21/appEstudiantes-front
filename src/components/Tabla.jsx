// Componente reutilizable de tabla
// Desktop: tabla clásica
// Mobile: cards con título a la izquierda y dato a la derecha

import React from "react";
import "../Styles/TablaReutilizable.css";

const TablaReutilizable = ({ datos = [], columnas = [] }) => {
  return (
    <>
      {/* ===== DESKTOP ===== */}
      <table className="tabla-reutilizable tabla-desktop">
        <thead>
          <tr>
            {columnas.map((col, index) => (
              <th key={index} style={{ textAlign: col.align || "left" }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {datos.map((fila, indexFila) => (
            <tr key={indexFila}>
              {columnas.map((col, indexCol) => (
                <td
                  key={indexCol}
                  style={{ textAlign: col.align || "left" }}
                >
                  {col.render ? col.render(fila) : fila[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== MOBILE ===== */}
      <div className="tabla-mobile">
        {datos.map((fila, indexFila) => (
          <div className="mobile-card" key={indexFila}>
            {columnas.map((col, indexCol) =>
              col.key !== "acciones" ? (
                <div className="mobile-row" key={indexCol}>
                  <span className="mobile-label">{col.header}</span>
                  <span className="mobile-value">
                    {col.render ? col.render(fila) : fila[col.key]}
                  </span>
                </div>
              ) : null
            )}

            {/* Acciones abajo */}
            {columnas.some(c => c.key === "acciones") && (
              <div className="mobile-actions">
                {columnas.find(c => c.key === "acciones")?.render(fila)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default TablaReutilizable;
