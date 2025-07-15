// RegistroCard.jsx
import React from "react";

const RegistroCard = ({ registro, onEditar, onExcluir }) => {
    let dataValida = "Data inválida";
    try {
        const data = new Date(registro.data);
        if (!isNaN(data.getTime())) {
            dataValida = data.toLocaleDateString("pt-BR");
        }
    } catch {
        dataValida = "Data inválida";
    }

    const kmInicial = parseFloat(registro.kmInicial ?? registro.kmIda ?? 0);
    const kmFinal = parseFloat(registro.kmFinal ?? registro.kmVolta ?? 0);
    const kmTotal = !isNaN(kmFinal - kmInicial) ? kmFinal - kmInicial : "--";

    return (
        <div className="registro-card">
            <div className="registro-header">
                <span>🚗 {registro.veiculo || "Veículo não informado"}</span>
                <span>📅 {dataValida}</span>
            </div>

            <div className="registro-body">
                <div className="dados-condutor">
                    <p>
                        <strong>Condutor:</strong> {registro.condutor || "Desconhecido"}
                    </p>
                    <p>
                        <strong>RG:</strong>{" "}
                        {registro.rgCondutor || registro.rg || "Não informado"}
                    </p>
                    {registro.destino && (
                        <p>
                            <strong>Destino:</strong> {registro.destino}
                        </p>
                    )}
                    {(registro.horaSaida || registro.horaRetorno || registro.horaInicio) && (
                        <p>
                            <strong>Horário:</strong>{" "}
                            {registro.horaSaida || registro.horaInicio || "--"} →{" "}
                            {registro.horaRetorno || "--"}
                        </p>
                    )}
                    {registro.observacao && (
                        <p>
                            <strong>Observações:</strong> {registro.observacao}
                        </p>
                    )}
                    {registro.editadoPor && (
                        <p>
                            <strong>Editado por:</strong> {registro.editadoPor}
                        </p>
                    )}
                </div>

                <div className="dados-km">
                    <div>
                        <strong>Inicial</strong>
                        <p>{isNaN(kmInicial) ? "--" : `${kmInicial} km`}</p>
                    </div>
                    <div>
                        <strong>Final</strong>
                        <p>{isNaN(kmFinal) ? "--" : `${kmFinal} km`}</p>
                    </div>
                    <div>
                        <strong>Total</strong>
                        <p>{isNaN(kmTotal) ? "--" : `${kmTotal} km`}</p>
                    </div>
                </div>

                <div className="registro-actions">
                    <button className="editar" onClick={() => onEditar(registro)}>
                        Editar
                    </button>
                    <button className="excluir" onClick={() => onExcluir(registro.id)}>
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistroCard;
