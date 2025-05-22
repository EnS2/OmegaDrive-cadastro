import React from "react";
import "./ResumoDia.css";

const ResumoDia = () => {
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const totalViagens = 5;
    const kmTotal = 120;

    return (
        <div className="resumo-container">
            <h3 className="resumo-titulo">Resumo do Dia</h3>
            <p><strong>Data:</strong> {dataAtual}</p>
            <p><strong>Viagens:</strong> {totalViagens}</p>
            <p><strong>Km Total:</strong> {kmTotal} km</p>
        </div>
    );
};


export default ResumoDia;
