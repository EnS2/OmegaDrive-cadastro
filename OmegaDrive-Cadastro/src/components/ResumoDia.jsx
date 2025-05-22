import React from "react";
import "./ResumoDia.css";

const ResumoDia = ({ selectedDate, viagens, totalKm }) => {
    return (
        <div className="resumo-container">
            <h3 className="resumo-titulo">Resumo do Dia</h3>
            <div className="resumo-data">
                {selectedDate.toLocaleDateString("pt-BR")}
            </div>
            <div className="resumo-dados">
                <div className="resumo-card">
                    <div className="resumo-label">Viagens</div>
                    <div className="resumo-valor">{viagens}</div>
                </div>
                <div className="resumo-card">
                    <div className="resumo-label">KM Total</div>
                    <div className="resumo-valor">{totalKm} km</div>
                </div>
            </div>
        </div>
    );
};

export default ResumoDia;
